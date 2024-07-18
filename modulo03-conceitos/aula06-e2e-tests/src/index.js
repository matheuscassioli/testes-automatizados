import server from "./server.js"

if (process.env.NODE_ENV !== 'test') {
    server.listen(process.env.PORT, () => {
        const serverInfo = server.address()
        console.log(`Server is running at ${serverInfo.address}:${serverInfo.port}`)
    })

}
export default server;