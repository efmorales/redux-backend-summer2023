const User = require('../model/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const createUser = async (params) => {
    let newUser = await new User({
        username: params.username,
        password: params.password,
    })
    return newUser
}

const hashPassword = (password) => {
    let hashedPassword = bcrypt.hash(password, saltRounds)
    return hashedPassword
}

const comparePassword = (inputPassword, dbPassword) => bcrypt.compare(inputPassword,dbPassword);

module.exports = { createUser, hashPassword, comparePassword }