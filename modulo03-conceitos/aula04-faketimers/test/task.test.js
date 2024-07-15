import { describe, jest, it, expect, beforeEach } from "@jest/globals"
import Task from "../src/task"
import { setTimeout } from "node:timers/promises"

describe('Task Test Suite', () => {

    let _logMock;
    let _task;

    beforeEach(() => {
        _logMock = jest.spyOn(
            console,
            console.log.name
        ).mockImplementation();

        _task = new Task()
    })

    it.skip('Should only run tasks that are due without fake timer (slow)', async () => {

        const tasks = [
            {
                name: 'Task-Will-Run-In-5-Secs',
                dueAt: new Date(Date.now() + 5000),
                fn: jest.fn()
            },
            {
                name: 'Task-Will-Run-In-10-Secs',
                dueAt: new Date(Date.now() + 10000),
                fn: jest.fn()
            },
        ]
        _task.save(tasks.at(0))
        _task.save(tasks.at(1))

        _task.run(200)
        await setTimeout(11e3)

        expect(tasks.at(0).fn).toHaveBeenCalled()
        expect(tasks.at(1).fn).toHaveBeenCalled()
    },
        //configurar para o jest aguardar 15s nesse teste
        15e3
    )

    it('Should only run tasks that are due with fake timer (fast)', async () => {

        jest.useFakeTimers()

        const tasks = [
            {
                name: 'Task-Will-Run-In-5-Secs',
                dueAt: new Date(Date.now() + 5000),
                fn: jest.fn()
            },
            {
                name: 'Task-Will-Run-In-10-Secs',
                dueAt: new Date(Date.now() + 10000),
                fn: jest.fn()
            },
        ]
        _task.save(tasks.at(0))
        _task.save(tasks.at(1))

        _task.run(200)

        jest.advanceTimersByTime(4000)
        expect(tasks.at(0).fn).not.toHaveBeenCalled()
        expect(tasks.at(1).fn).not.toHaveBeenCalled()


        jest.advanceTimersByTime(2000)
        expect(tasks.at(0).fn).toHaveBeenCalled()
        expect(tasks.at(1).fn).not.toHaveBeenCalled()

        jest.advanceTimersByTime(4000)
        expect(tasks.at(1).fn).toHaveBeenCalled()

        jest.useRealTimers()
    })
})