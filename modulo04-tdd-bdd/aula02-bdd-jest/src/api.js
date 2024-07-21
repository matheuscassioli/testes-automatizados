import { once } from "node:events";
import { createServer } from "node:http"

const usersDb = [
]

function getUserCategory(userBirthDay) {
    const age = new Date().getFullYear() - new Date(userBirthDay).getFullYear()
    if (age < 18) {
        throw new Error('User must be 18yo or other')
    }
    if (age >= 18 && age <= 25) {
        return 'young-adult'
    }
    return ''
}

const server = createServer(async (request, response) => {

    try {
        if (request.url === "/users" && request.method === "POST") {
            const user = JSON.parse(await once(request, 'data'))

            const uptadetUser = {
                ...user,
                id: Math.random(),
                category: getUserCategory(user.birthDay)
            }
            usersDb.push(uptadetUser)

            response.writeHead(201, { 'Content-Type': 'application/json' })

            response.end(JSON.stringify({ id: uptadetUser.id, category: uptadetUser.category }))
            return
        }

        if (request.url.startsWith('/users') && request.method === "GET") {
            const [, , id] = request.url.split('/')

            const user = usersDb.find(user => {
                if (user.id == id) {
                    return true
                }
                return false
            })

            response.end(JSON.stringify(user))
            return
        }

    } catch (error) {
        if (error.message.includes('18yo')) {
            response.writeHead(400, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({
                message: error.message
            }))
            return
        }
        response.writeHead(500)
        response.end('Deu ruim')
    }
    response.end('hello world')
})

export { server }