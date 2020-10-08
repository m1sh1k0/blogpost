import mongoose from 'mongoose'
import logger from './logger'

const connection = () => {
    const uri = process.env.MONGO_URI

    mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then(() => logger.info(`Mongo connection opened on ${uri}`))
        .catch((err) => logger.info(`Mongo failed connect, error: ${err}`))
}

export default connection
