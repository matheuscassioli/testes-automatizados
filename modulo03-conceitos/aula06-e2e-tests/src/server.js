import { createServer } from "node:http"
import { once } from "node:events"
import Person from "./person.js"

const server = createServer(async (request, response) => {
    if (request.method !== 'POST' || request.url !== '/persons') {
        response.writeHead(404)
        response.end('Não pode')
        return
    }

    try {
        const data = (await once(request, 'data')).toString()
        const result = Person.process(JSON.parse(data)) 
        return result

    } catch (error) { 
        if (error.message.includes('required') || error.message.includes('invalid')) {
            response.writeHead(400)
            response.write(
                JSON.stringify({
                    validationError: error.message
                })
            )
            response.end()
            return;
        }


        console.error('Deu ruim', error)
        response.writeHead(500)
        response.end()
    }

})

export default server

/* 
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{
        "name": "matheus cassioli", 
        "cpf": "123.123.123-12"
    }' \
  http://localhost:3000/persons
*/