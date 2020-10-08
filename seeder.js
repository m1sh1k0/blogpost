import mongoose from 'mongoose'
import User from './api/Models/User'
import Post from './api/Models/Post'
import Comment from './api/Models/Comment'
import faker from 'faker'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.MONGO_URI

const users = [
    {
        fullname: `${faker.name.firstName()}, ${faker.name.lastName()}`,
        email: 'user@mail.com',
        password: '123123'
    },
    {
        fullname: `${faker.name.firstName()}, ${faker.name.lastName()}`,
        email: faker.internet.email().toLocaleLowerCase(),
        password: '123123'
    },
    {
        fullname: `${faker.name.firstName()}, ${faker.name.lastName()}`,
        email: faker.internet.email().toLocaleLowerCase(),
        password: '123123'
    }
]

const admin = {
    fullname: `Admin Adminovich`,
    email: 'admin@mail.com',
    password: 'admin1'
}
console.log(admin)

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    })
    .then(async () => {
        await User.createAdmin(admin)
        users.forEach(async (user, index) => {
            try {
                const created = await User.signUp(user)
                const createdPost = await Post.create({
                    title: faker.name.title(),
                    body: `${faker.lorem.text()} ${faker.lorem.text()}`,
                    author: created._id
                })
                await Comment.create({
                    fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
                    email: faker.internet.email(),
                    text: `${faker.lorem.text()}`,
                    post: createdPost._id
                })
                if (index === users.length - 1) {
                    console.log('Done!')
                    process.exit(0)
                }
            } catch (e) {
                console.log(e)
            }
        })
    })
    .catch((err) => console.log(`Mongo failed connect, error: ${err}`))
