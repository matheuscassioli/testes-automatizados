import { Given } from "@cucumber/cucumber"
import { server } from "../src/api.js"
import sinon from 'sinon'

let _testServer
let _testServerAddress

function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
        server.once('error', (err) => reject(err))
        server.once('listening', () => resolve())
    })
}

Given('I have a running server', async function () {
    _testServer = server.listen();
    await waitForServerStatus(_testServer)

    const serverInfo = _testServer.address()
    _testServerAddress = `http://localhost:${serverInfo.port}`
})

Given('The current date is {string}', async function (date) {
    sinon.restore()
    const clock = sinon.useFakeTimers(new Date(date).getTime())
    const d = newDate()
    console.log(d, 'd')
    debugger
    this.clock = clock
});