import { describe, it, expect, jest } from "@jest/globals"
import Person from "../src/person.js"

describe('#Person Suite', () => {
    describe('#validate', () => {
        it('should throw if the name is not present', () => {
            const mockInvalidPerson = {
                name: '',
                cpf: '123.456.789-10'
            }

            expect(() => Person.validate(mockInvalidPerson)).toThrow(new Error('name is required'))
        })

        it('should throw if the cpf is not present', () => {
            const mockInvalidCPF = {
                name: 'Cristiano',
                cpf: ''
            }
            expect(() => Person.validate(mockInvalidCPF)).toThrow(new Error('cpf is required'))
        })

        it('should not throw person is valid', () => {
            const mockValidPerson = {
                name: 'Cristiano Pelé',
                cpf: '123456789'
            }
            expect(() => Person.validate(mockValidPerson)).not.toThrow(new Error('cpf is required'))
        })
    })
    describe('#format', () => {
        it('should fotmar the person name and CPF', () => {
            //dados ja validados
            ///AAA  
            //Arrange = prepara
            const mockPerson = {
                name: 'Matheus Cassioli',
                cpf: '438.651.558-55'
            }
            //Act = executa
            const formatedPerson = Person.format(mockPerson)
            //Assert = valida
            const expected = {
                name: 'Matheus',
                cpf: '43865155855',
                lastName: 'Cassioli'
            }
            expect(formatedPerson).toStrictEqual(expected)
        })
    })

    describe('#process', () => {
        it('should process a valid person', () => {
            //Já validou e formatou, agora salvar
            const mockPerson = {
                name: 'Matheus Cassioli',
                cpf: '438.651.558-55'
            }

            jest
                .spyOn(
                    Person,
                    Person.validate.name
                )
                .mockImplementation(() => {
                    throw new Error('Deu ruim !!')
                })
            // .mockReturnValue()


            jest
                .spyOn(
                    Person,
                    Person.format.name
                )
                .mockReturnValue({
                    name: 'Matheus',
                    cpf: '43865155855',
                    lastName: 'Cassioli'
                })

            const result = Person.process(mockPerson)
            const expected = 'ok'
            expect(result).toStrictEqual(expected)

        })
    })

})