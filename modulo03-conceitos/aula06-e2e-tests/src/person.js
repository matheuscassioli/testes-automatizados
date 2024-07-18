class Person {

    static validate(person) {
        if (!person.name) throw new Error('name is required')
        if (!person.cpf) throw new Error('cpf is required')
    }

    static process(person) {
        this.validate(person)
        const personFormated = this.format(person)
        this.save(personFormated)
        return "ok"
    }

    static save(person) {
        if (!['cpf', 'name', 'lastName'].every(prop => person[prop])) {
            throw new Error(`Cannot save invalid person: ${JSON.stringify(person)}`)
        }
        console.log(`Registrado com sucesso: ${person.name + ' ' + person.lastName}`)
    }

    static format(person) {
        const [name, ...lastName] = person.name.split(' ')
        return {
            name,
            cpf: person.cpf.replace(/\D/g, ''),
            lastName: lastName.join(' ')
        }

    }
}


export default Person