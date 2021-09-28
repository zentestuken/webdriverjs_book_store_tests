// here, random data are generated or stored
// ..using 'faker' module (should be npm-installed)

const faker = require('faker');

let fake = function() {
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let username = firstName + lastName;

    return {
        firstName: firstName,
        lastName: lastName,
        username: username
    }
}


module.exports = fake;