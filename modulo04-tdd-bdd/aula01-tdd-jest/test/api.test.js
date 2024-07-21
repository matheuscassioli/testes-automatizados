import { it, expect, describe, beforeAll, afterAll, jest } from "@jest/globals"
import { server } from "../src/api"


describe('API Users E2E Suite', () => {

    function createUser(data) {
        const urlFecth = `${_testServerAddress}/users`

        return fetch(urlFecth, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    async function findUserById(id) {
        const urlFecth = `${_testServerAddress}/users/${id}`
        const user = await fetch(urlFecth)
        return user.json()
    }



    let _testServer
    let _testServerAddress

    function waitForServerStatus(server) {
        return new Promise((resolve, reject) => {
            server.once('error', (err) => reject(err))
            server.once('listening', () => resolve())
        })
    }

    beforeAll(async () => {
        _testServer = server.listen();

        await waitForServerStatus(_testServer)
        const serverInfo = _testServer.address()
        _testServerAddress = `http://localhost:${serverInfo.port}`
    })

    afterAll(done => {
        server.closeAllConnections()
        _testServer.close(done)
    })

    it('Should register a new user with young-adult category', async () => {
        const expectedCategory = 'young-adult'

        //IMPORTANTE : POIS O ANO QUE VEM O TESTE PODE QUEBRAR, QUANDO USAR DATAS, MOCKAR AS MESMAS 
        jest.useFakeTimers({
            now: new Date('2024-06-21T00:00')
        })

        const response = await (createUser({
            name: 'Matheus Cassioli',
            birthDay: '2003-01-01' //21 anos
        }))

        expect(response.status).toBe(201)
        const result = await response.json()
        expect(result.id).not.toBeUndefined()

        const user = await findUserById(result.id)


        expect(user.category).toBe(expectedCategory)
    })

    it.todo('Should register a new user with adult category')
    it.todo('Should register a new user with senior category')

    it('Should throw an error when registering a under-age user', async () => {
        const response = await (createUser({
            name: 'Matheus Cassioli',
            birthDay: '2020-01-01' //4 anos
        }))
        expect(response.status).toBe(400)
        const result = await response.json()
        expect(result).toEqual({ message: 'User must be 18yo or other' })

    })
})

/*
    Deve cadastrart usuarios e definir uma categoria onde:

        -Jovens adultos:
            -Usuários de 18-25 anos
        -Adultos:
            -Usuários de 26-50
        -Idosos:
            -51+ 
        -Menor de idade:
            -Retorna erro! 

*/
