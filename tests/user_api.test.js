const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)


describe('invalid user creation', () => {

    test('invalid user creation returns a suitable status code', async () => {
        const newUser = {
            userName: "ra",
            name: "mikku",
            password: "asdf"
        }
    
        const response = await api.post('/api/users').send(newUser)
        expect(response.status).toBe(400)
        expect(response.body.error).toContain('username must be at least 3 characters long')
    })
})

