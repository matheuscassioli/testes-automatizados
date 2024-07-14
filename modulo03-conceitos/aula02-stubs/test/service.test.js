import { it, expect, describe, beforeEach, jest } from "@jest/globals"
import Service from "../src/service"
import fs from 'node:fs/promises'

describe('Service Test Suite', () => {

    let _service

    const filename = 'testfile.ndjson'

    beforeEach(() => {
        _service = new Service({
            filename
        })
    })

    describe('#read', () => {
        it('should return an empty array if the file is empty', async () => {

            jest.spyOn(
                fs,
                fs.readFile.name
            )
                .mockResolvedValue('')

            const result = await _service.read()

            console.log(result, 'result')
            expect(result).toEqual([])

        })

        it('should return users without password if file contains users', async () => {
            const dbData = [{
                username: 'user1',
                password: ' pass1',
                createdAt: new Date().toISOString()
            },
            {
                username: 'user1',
                password: ' pass2',
                createdAt: new Date().toISOString()
            }]

            const fileContent = dbData.map(item => JSON.stringify(item).concat('\n')).join('')

            jest.spyOn(
                fs,
                "readFile"
            ).mockResolvedValue(fileContent)

            const result = await _service.read()

            const expected = dbData.map(({ password, ...rest }) => ({ ...rest }))

            expect(result).toEqual(expected)
        })
    })
})
