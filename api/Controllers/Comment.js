import Comment from '../Models/Comment'
import mongoose from 'mongoose'
import Post from '../Models/Post'

const ObjectId = mongoose.Types.ObjectId

const CommentController = {
    leave: async (req, res) => {
        try {
            const post = await Post.findOne({ slug: req.params.slug })
            if (!post) throw { message: 'Post not found' }
            const comment = await Comment.create({
                fullname: req.body.fullname,
                email: req.body.email,
                text: req.body.text,
                post: ObjectId(post._id)
            })
            res.status(201).json(comment)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default CommentController
