// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {

    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => {
        return total + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {

    let maxLikes = -1
    let favorite = null

    for (const blog of blogs) {
        if (blog.likes > maxLikes) {
            maxLikes = blog.likes
            favorite = blog
        }
    }

    return favorite
}

const mostBlogs = (blogs) => {

    if (blogs.length === 0) return null;

    const blogsCountByAuthor = {}

    blogs.forEach((blog) => {
        if (blog.author in blogsCountByAuthor) {
            blogsCountByAuthor[blog.author]++
        } else {
            blogsCountByAuthor[blog.author] = 1
        }
    })
    const authors = Object.keys(blogsCountByAuthor)
    const mostBlogsAuthors = authors.reduce((maxAuthor, currentAuthor) => {
        return blogsCountByAuthor[currentAuthor] > blogsCountByAuthor[maxAuthor]
            ? currentAuthor
            : maxAuthor
    })

    return {
        author: mostBlogsAuthors,
        blogs: blogsCountByAuthor[mostBlogsAuthors]
    }
}


const mostLikes = (blogs) => {

    const likesByAuthor = {}

    blogs.forEach((blog) => {
        if (likesByAuthor[blog.author]) {
            likesByAuthor[blog.author] += blog.likes
        } else {
            likesByAuthor[blog.author] = blog.likes
        }
    })

    let mostLikesAuthor = ''
    let maxLikes = 0

    Object.keys(likesByAuthor).forEach((author) => {
        if (likesByAuthor[author] > maxLikes) {
            mostLikesAuthor = author
            maxLikes = likesByAuthor[author]
        }
    })

    return {
        author: mostLikesAuthor,
        likes: maxLikes
    }

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}