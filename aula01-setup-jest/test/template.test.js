import { it } from "@jest/globals"

function som(a, b) {  
    return a + b 
}

it('som two valus', () => {
    expect(som(2, 3)).toBe(5)
})