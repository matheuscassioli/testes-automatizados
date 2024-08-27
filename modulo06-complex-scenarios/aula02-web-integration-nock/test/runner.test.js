import { it, expect, describe } from "@jest/globals"
import { fetchAoiByPage } from "../src/runner.js"
import nock from 'nock'
import page01fixture from "./fixures/get-page-01.json"
import page02fixture from "./fixures/get-page-02.json"

describe('Web Integration Test Suit', () => {
    it('shoould return the right object with right properties', async () => {
        const scope = nock('https://rickandmortyapi.com/api ')
            .get('/character/')
            .query({ page: 1 })
            .reply(200, page01fixture)

        const page01 = await fetchAoiByPage(1)
        expect(page01).toEqual([{
            "id": 1,
            "name": 'Rick Sanchez',
            "image": 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
        }])
        scope.done
    })

    it('shoould return the right object with right properties', async () => {
        const scope = nock('https://rickandmortyapi.com/api ')
            .get('/character/')
            .query({ page: 2 })
            .reply(200, page02fixture)
        const page02 = await fetchAoiByPage(2)

        expect(page02).toEqual([{
            "id": 21,
            "name": 'Aqua Morty',
            "image": 'https://rickandmortyapi.com/api/character/avatar/21.jpeg'
        }])
        scope.done
    })
})