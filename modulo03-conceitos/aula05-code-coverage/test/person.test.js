import { describe, jest, it, expect, beforeEach } from "@jest/globals"
import { mapPerson } from "../src/mapPerson.js"

describe('Person Test Suite', () => {

    describe('happy path', () => {

        it('should map person', () => {
            const personStr = '{"name":"matheuscassioli","age":26}'
            const personObj = mapPerson(personStr)

            expect(personObj).toEqual({
                name: "matheuscassioli",
                age: 26,
                createdAt: expect.any(Date)
            })

        })

    })


    describe('what cpverage doesnt tell you', () => {

        it('should not map person given invalid JSON string', () => {

            const personStr = '{"name":'
            expect(() => mapPerson(personStr)).toThrow('Unexpected end of JSON input')
        })

        it('should not map person given invalid JSON data', () => {

            const personStr = '{}'
            const personObj = mapPerson(personStr)
            expect(personObj).toEqual({
                name: undefined,
                age: undefined,
                createdAt: expect.any(Date)
            })
        })

    })

})