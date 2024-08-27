import { it, describe, jest, expect } from "@jest/globals"
import { run } from "./../src/runner.js"
import lokijs from 'lokijs'

const ID_UUID = '0'
const metaDataLokiInsert = {
    meta: {
        revision: 0, created: Date.now(), version: 0
    },
    $Loki: 1
}
jest.mock('node:crypto', () => ({
    randomUUID: jest.fn(() => ID_UUID)
}))

jest.mock('lokijs')

function configureDbDriverMock(initialData = [{ collection: '', data: [] }]) {
    const spies = {
        db: null,
        addColetion: null,
        insert: null,
        find: null
    }
    const seedDb = () => {
        const dbData = {}
        initialData.forEach(({ collection, data }) => {
            dbData[collection] ??= []
            data.forEach(item => dbData[collection].push(item))
        })
        return dbData
    }

    spies.db = lokijs.mockImplementationOnce((dbName) => {
        const _dbData = seedDb()
        const addCollection = spies.addColetion = jest.fn((colletionName) => {
            const insert = spies.insert = jest.fn((data) => {
                const item = {
                    ...data,
                    ...metaDataLokiInsert
                }

                _dbData[colletionName].push(item)
                return item
            })
            const find = spies.find = jest.fn(() => {
                return _dbData[colletionName]
            })
            return {
                insert,
                find
            }
        })
        return { addCollection }
    })
    return spies
}

describe('Complex tests', () => {
    it('should spy db driver calls', async () => {
        const colletionName = 'characters'
        const dbName = 'heroes'
        const initialData = [{
            id: '1',
            age: 80,
            name: 'Colorado',
            power: 'Axe',
            ...metaDataLokiInsert,
        }]
        const seedDB = [
            {
                collection: colletionName,
                data: initialData
            }
        ]

        jest.spyOn(console, 'log').mockImplementation(() => { })

        const spies = configureDbDriverMock(seedDB)


        const input = {
            name: 'matheus',
            power: 'rich',
            age: 50
        }
        await run(input)

        const insertCall = {
            ...input,
            id: ID_UUID
        }

        const expectedInsertResult = {
            ...input,
            ...metaDataLokiInsert,
            id: ID_UUID
        }

        expect(spies.db).toHaveBeenNthCalledWith(1, dbName)
        expect(spies.addColetion).toHaveBeenNthCalledWith(1, colletionName)
        expect(spies.insert).toHaveBeenNthCalledWith(1, insertCall)
        expect(spies.find).toHaveBeenNthCalledWith(1)

        const logCalls = console.log.mock.calls
        expect(logCalls[0]).toEqual([
            'createHero',
            expectedInsertResult
        ])

        const expectedCurrentDb = initialData.concat(expectedInsertResult)
        expect(logCalls[1]).toEqual([
            'listHeroes',
            expectedCurrentDb
        ])
    })
})