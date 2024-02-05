const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('path:  ', request.path)
    logger.info('body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknownEndPoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    } else if (error.name === 'TokenExpiredError') {
        {
            return response.status(401).json({
                error: 'token expired'
            })
        }
    }

    next(error)
}


const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = authorization.replace('bearer ', '')
        console.log('extracted token:', token)
        request.token = token
    }
    next()
}

const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
        return response.status(401).json({ error: 'token missing' })
    }

    const token = authorization.substring(7)
    console.log('Received Token:', token);

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('Decoded Token:', decodedToken);
        const user = await User.findById(decodedToken.id)
        request.user = user
        next()
    } catch (error) {
        console.error('Token verification error:', error.message)
        response.status(401).json({ error: 'invalid token' })
    }
}


module.exports = {
    requestLogger,
    unknownEndPoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}