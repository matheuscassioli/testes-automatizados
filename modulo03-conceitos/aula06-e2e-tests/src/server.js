import { createServer } from "node:http"
import { once } from "node:events"

const server = createServer(async (request, response) => {

    // if (request.method !== 'POST' || request.url !== '/persons') {
    //     response.writeHead(404)
    //     response.end()
    //     return
    // }

    try {
        const data = await once(request, 'data')
        console.log(data, 'data')
        return response.end()
    } catch (error) {
        console.error('Deu ruim', error)
        response.writeHead(500)
        response.end()
    }

})

export default server

/*

curl -X POST \
-H 'Content-Type: application/json \

-d '{
    "name":"matheuscassioli", 
    "cpf": 123.123.123-12,  
}'\

https://localhost:3000/persons

*/ 