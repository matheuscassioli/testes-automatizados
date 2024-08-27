import axios from 'axios'

async function fetchAoiByPage(page, count = 1) {
    const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`)

    const result = data?.results?.slice(0, count).map(item => {
        return {
            id: item.id,
            name: item.name,
            image: item.image
        }
    })
    return result
}
export { fetchAoiByPage }