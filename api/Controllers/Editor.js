import User from '../Models/User'
import Post from '../Models/Post'
import Comment from '../Models/Comment'
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

const EditorController = {
    register: async (req, res) => {
        try {
            const user = await User.signUp(req.body)
            res.status(201).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    login: async (req, res) => {
        try {
            const user = await User.signIn(req.body)
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    list: async (req, res) => {
        try {
            const posts = await Post.aggregate()
                .match({
                    author: ObjectId(req.user._id)
                })
                .graphLookup({
                    from: 'comments',
                    startWith: '_id',
                    connectFromField: '_id',
                    connectToField: 'post',
                    as: 'comments'
                })
            if (!posts.length) throw { message: 'Posts not found' }
            res.status(200).json({ posts })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    view: async (req, res) => {
        try {
            const post = await Post.aggregate()
                .match({ slug: req.params.slug })
                .graphLookup({
                    from: 'comments',
                    startWith: '_id',
                    connectFromField: '_id',
                    connectToField: 'post',
                    as: 'comments'
                })
            if (!post.length) throw { message: 'Post not found' }
            res.status(200).json(post)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    edit: async (req, res) => {
        const { title, body } = req.body
        try {
            const post = await Post.findOneAndUpdate(
                { slug: req.params.slug },
                { title, body },
                { new: true }
            )
            if (!post) throw { message: 'Post not found or slug is changed' }
            res.status(200).json({ post })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    manageComment: async (req, res) => {
        try {
            const edited = await Comment.findOneAndUpdate(
                { _id: ObjectId(req.params.id) },
                { isHidden: req.params.bool },
                { new: true }
            )
            if (!edited) throw { message: 'Comment not found' }
            res.status(200).json(edited)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default EditorController
