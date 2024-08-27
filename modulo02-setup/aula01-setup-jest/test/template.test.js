import { it, expect } from "@jest/globals"

function som(a, b) {
    return a + b 
}

it('som two values 2', () => {
    expect(som(2, 3)).toBe(5)
})