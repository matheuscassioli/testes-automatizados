import { it, expect, describe, jest, beforeAll, afterAll } from "@jest/globals"


function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
        server.once('error', (err) => reject(err))
        server.once('listening', () => resolve())
    })
}


describe('E2E Test Suite', () => {

    describe('E2E Tests For Serverin a non-test env', () => {
        it('should start server with PORT 4000', async () => {
            const PORT = 4000
            process.env.NODE_ENV = 'production'
            process.env.PORT = PORT

            jest.spyOn(
                console,
                console.log.name
            )


            const { default: server } = await import("../src/index.js")


            await waitForServerStatus(server)
            const serverInfo = server.address()

            expect(serverInfo.port).toBe(4000)
            expect(console.log).toHaveBeenCalledWith(`Server is running at ${serverInfo.address}:${serverInfo.port}`)

            return new Promise(resolve => server.close(resolve))
        })
    })

    describe('E2E Tests For Server ', () => {
        let _testServer
        let _testServerAddress

        beforeAll(async () => {
            process.env.NODE_ENV = 'test'
            const { default: server } = await import("../src/index.js")
            _testServer = server.listen();

            await waitForServerStatus(_testServer)
            const serverInfo = _testServer.address()
            _testServerAddress = `http://localhost:${serverInfo.port}`
        })

        afterAll(done => _testServer.close(done))

        it('should return 400 for unsupported routes', async () => {
            const response = await fetch(`${_testServerAddress}/unsupported`, {
                method: 'POST',
            })
            expect(response.status).toBe(404)
        })

        it('should return 500 for server error', async () => {
            const response = await fetch(`${_testServerAddress}/persons`, {
                method: 'POST',
            })
            expect(response.status).toBe(500)
        })

        it('should return 400 and missing file message when body is invalid', async () => {
            const invalidCPF = { name: 'Fulano da silva' }
            const response = await fetch(`${_testServerAddress}/persons`, {
                method: 'POST',
                body: JSON.stringify(invalidCPF)
            })
            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.validationError).toEqual('cpf is required')
        })

        it('should return 400 and missing file message when name is invalid', async () => {
            const invalidName = { cpf: '123.123.123-12' }
            const response = await fetch(`${_testServerAddress}/persons`, {
                method: 'POST',
                body: JSON.stringify(invalidName)
            })
            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.validationError).toEqual('name is required')
        })

        it('should return invalid formated name', async () => {
            const invalidName = { name: 'matheuscassioli', cpf: '123.123.123-12' }

            const response = await fetch(`${_testServerAddress}/persons`, {
                method: 'POST',
                body: JSON.stringify(invalidName)
            })
            expect(response.status).toBe(400)
            const data = await response.json()

            expect(data.validationError).toEqual('Cannot save invalid person: {\"name\":\"matheuscassioli\",\"cpf\":\"12312312312\",\"lastName\":\"\"}')
        })


        it('should return success save user', async () => {
            const validUser = { name: 'matheus cassioli', cpf: '123.123.123-12' }

            const response = await fetch(`${_testServerAddress}/persons`, {
                method: 'POST',
                body: JSON.stringify(validUser)
            })

            expect(console.log).toHaveBeenCalledWith(`Registrado com sucesso: ${validUser.name}`)
        })
    })

})