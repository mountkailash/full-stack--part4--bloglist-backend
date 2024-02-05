const blogsRouter = require('express').Router()
const Blog = require('../models/blog')





blogsRouter.post('/', async (request, response) => {
    console.log('Received request to create a new blog:', request.body);
    const body = request.body

    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'Invalid user' });
    }

    if (!body.title || !body.url) {
        return response.status(400).json({ error: 'Title and URL are missing' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }

})


blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user


    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    // Compare blog's user ID with the ID of the logged-in user
    if (blog.user.toString() !== user._id.toString()) {
        return response.status(401).json({ error: 'unauthorised to delete this blog' })
    }

    // If user is the creator of the blog, delete the blog
    await Blog.findByIdAndDelete(request.params.id)

    // Remove the blog ID from the user's blogs array
    user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
    await user.save()

    response.status(204).end()

})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        user: body.user,
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

    if (!updatedBlog) {
        return response.status(404).json({ error: 'Blog not found' });
    }
    response.json(updatedBlog)
})

// blogsRouter.put('/:id', async (request, response) => {
//     const body = request.body

//     // Extract necessary fields for the update
//     const {user, title, author, likes, url} = body
//     const updatedFields = {user, title, author, likes, url}

//     // Use { new: true } to get the updated document after the update
//     const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedFields, { new: true })

//     if (!updatedBlog) {
//         return response.status(404).json({ error: 'Blog not found' })
//     }
//     response.json(updatedBlog)

// })

module.exports = blogsRouter; 