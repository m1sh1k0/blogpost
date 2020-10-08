import User from '../Models/User'
import Post from '../Models/Post'
import Comment from '../Models/Comment'
import mongoose from 'mongoose'
import { log } from 'winston'

const ObjectId = mongoose.Types.ObjectId

const AdminController = {
    login: async (req, res) => {
        try {
            const user = await User.signIn(req.body)
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    filterList: async (req, res) => {
        try {
            if (!req.user.isAdmin) throw { message: 'Not allowed' }
            console.log(req.params.status)
            const posts = await Post.find({ confirm_status: req.params.status })
            if (!posts.length) throw { message: 'Posts not found' }
            res.status(200).json(posts)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    allPosts: async (req, res) => {
        try {
            if (!req.user.isAdmin) throw { message: 'Not allowed' }
            const posts = await Post.aggregate().graphLookup({
                from: 'comments',
                startWith: '_id',
                connectFromField: '_id',
                connectToField: 'post',
                as: 'comments'
            })
            if (!posts.length) throw { message: 'Posts not found' }
            res.status(200).json(posts)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    viewPost: async (req, res) => {
        try {
            if (!req.user.isAdmin) throw { message: 'Not allowed' }
            const post = await Post.aggregate()
                .match({ slug: req.params.id })
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
    listEditors: async (req, res) => {
        try {
            if (!req.user.isAdmin) throw { message: 'Not allowed' }
            const editors = await User.find({ isAdmin: false })
            res.status(200).json(editors)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    manageEditor: async (req, res) => {
        try {
            if (!req.user.isAdmin) throw { message: 'Not allowed' }
            const editor = await User.findByIdAndUpdate(
                { _id: ObjectId(req.params.id) },
                {
                    isConfirmed: req.params.confirm
                },
                { new: true }
            )
            if (!editor) throw { message: 'Editor not found' }
            res.status(200).json(editor)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    editPost: async (req, res) => {
        try {
            if (!req.user.isAdmin) throw { message: 'Not allowed' }
            const { title, body, confirm_status } = req.body
            const values = ['pending', 'confirmed', 'rejected']
            if (confirm_status)
                if (values.indexOf(confirm_status) < 0)
                    throw {
                        message: `confirm status possible values: pending, confirmed, rejected`
                    }
            const post = await Post.findOneAndUpdate(
                { slug: req.params.slug },
                { title, body, confirm_status },
                { new: true }
            )
            if (!post) throw { message: 'Post not found or slug is changed' }
            res.status(200).json(post)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    deletePost: async (req, res) => {
        try {
            if (!req.user.isAdmin) throw { message: 'Not allowed' }
            const deleted = await Post.findOneAndDelete({
                _id: ObjectId(req.params.id)
            })
            if (!deleted) throw { message: 'Post not found' }
            res.status(200).json(deleted)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    manageComment: async (req, res) => {
        try {
            if (!req.user.isAdmin) throw { message: 'Not allowed' }
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

export default AdminController
