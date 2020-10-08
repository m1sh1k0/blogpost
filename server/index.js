import express from 'express'
import logger from './service/logger'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import router from '../api/router'
import mongo_connect from './service/mongoose'

dotenv.config()

const server = express()

server.use(bodyParser.json())
server.use(router)

setImmediate(() => {
    const [host, port, env] = [
        process.env.HOST,
        process.env.PORT,
        process.env.ENVIRONMENT
    ]
    server.listen(port, host, () => {
        logger.info(
            `Express server listening on http://${host}:${port}, in ${env} mode`
        )
    })
})

mongo_connect()
