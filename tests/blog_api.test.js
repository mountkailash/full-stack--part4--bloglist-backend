const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)
afterAll(async () => {
    await mongoose.connection.close()
})

test('blogs have property id instead of _id', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]
    expect(blog.id).toBeDefined()
    expect(blog._id).toBeUndefined()
}, 100000)

// const getToken = async () => {
//     const response = await api.post('/api/login').send({
//         username: 'ram',
//         password: 'sita'
//     })
//     console.log('the return token is:', response.body.token)
//     return response.body.token
// }

const loginUserAndGetToken = async () => {
    const userCredentials = {
        username: 'ram',
        password: 'sita'
    }

    const loginResponse = await api.post('/api/login').send(userCredentials)

    if(loginResponse.status === 200) {
        const {token} = loginResponse.body

        return token
    }
    throw new Error('login failed')
}

test('successfully creates a new blog post', async () => {
    const authToken = await loginUserAndGetToken()
    const initialBlogs = await Blog.find({})

    const newBlog = {
        title: 'test blog',
        author: 'test author',
        url: 'https://testblog.com',
        likes: 5
    }

    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${authToken}`).send(newBlog)
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).not.toHaveProperty('error');

    const updatedBlog = await Blog.find({})
    expect(updatedBlog).toHaveLength(initialBlogs.length + 1)

    // const createdBlog = response.body
    // expect(createdBlog.title).toBe(newBlog.title)
    // expect(createdBlog.author).toBe(newBlog.author)
    // expect(createdBlog.url).toBe(newBlog.url)
    // expect(createdBlog.likes).toBe(newBlog.likes)
}, 100000)

test('missing likes property defaults to 0', async () => {

    const newBlog = {
        title: 'test blog',
        author: 'test author',
        url: 'https://testblog.com'
    }

    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.status).toBe(201)
    expect(response.body.likes).toBe(0)
})

test('creating new blog with missing title or url', async () => {

    const newBlog = {
        author: 'test author',
        likes: 5
    }

    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.status).toBe(400)
})

describe('deletion of a blog', () => {

    let blogId;

    beforeEach(async () => {
        const newBlog = {
            title: 'test',
            author: 'author',
            url: 'https://testblog.com',
            likes: 7
        }
        const response = await api.post('/api/blogs').send(newBlog)
        blogId = response.body.id
    })

    test('succeeds with status code 204 if id is valid', async () => {

        const response = await api.delete(`/api/blogs/${blogId}`)
        expect(response.status).toBe(204)
    })

    test('trying to get a deleted blog', async () => {
        await api.delete(`/api/blogs/${blogId}`)
        const response = await api.get(`/api/blogs/${blogId}`)
        expect(response.status).toBe(404)
    })
})

describe('updating an individual blog post', () => {

    let blogId;

    beforeEach(async () => {
        const newBlog = {
            title: 'test',
            author: 'author',
            url: 'https://testblog.com',
            likes: 11
        }
        const response = await api.post('/api/blogs').send(newBlog)
        blogId = response.body.id
    })

    test('updating like of blog post', async () => {

        const updatedLikes = 15
        const updatedBlog = {
            likes: updatedLikes
        }
        const response = await api.put(`/api/blogs/${blogId}`).send(updatedBlog)
        expect(response.status).toBe(200)
        const updatedBlogResponse = await api.get(`/api/blogs/${blogId}`)
        expect(updatedBlogResponse.body.likes).toBe(updatedLikes)
    })
})

describe('adding a blog fail with proper status code', () => {
    test('fails to create a new blog post without a token', async () => {
        const initialBlogs = await Blog.find({});
        const newBlog = {
            title: 'test blog',
            author: 'test author',
            url: 'https://testblog.com',
            likes: 5
        };
    
        // Send the request without a token
        const response = await api.post('/api/blogs').send(newBlog);
    
        expect(response.status).toBe(401);
    
        // Ensure that the number of blogs remains the same
        const updatedBlog = await Blog.find({});
        expect(updatedBlog).toHaveLength(initialBlogs.length);
    }, 200000);
    
})