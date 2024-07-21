import { it, expect } from "@jest/globals"

function som(a, b) {
    return a + b + 1
}

it('som two values', () => {
    expect(som(2, 3)).toBe(6)
})