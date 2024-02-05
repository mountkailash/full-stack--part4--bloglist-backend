// const login = require("../controllers/login")
// const app = require('../app')


// const loginUserAndGetToken = async () => {
//     const userCredentials = {
//         username: 'ram',
//         password: 'sita'
//     }

//     const loginResponse = await app.post('/api/login').send(userCredentials)

//     if(loginResponse.status === 200) {
//         const {token} = loginResponse.body

//         return token
//     }
//     throw new Error('login failed')
// }

// module.exports = {
//     loginUserAndGetToken
// }