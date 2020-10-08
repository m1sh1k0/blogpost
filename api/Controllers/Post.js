import Post from '../Models/Post'

const PostConstroller = {
    list: async (req, res) => {
        try {
            const posts = await Post.aggregate()
                .match({
                    confirm_status: 'confirmed'
                })
                .graphLookup({
                    from: 'comments',
                    startWith: '_id',
                    connectFromField: '_id',
                    connectToField: 'post',
                    as: 'comments',
                    restrictSearchWithMatch: { isHidden: false }
                })
            if (!posts.length) throw { message: 'Posts not found' }
            res.status(200).json({ posts })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    view: async (req, res) => {
        try {
            const post = await Post.aggregate()
                .match({
                    slug: req.params.slug,
                    confirm_status: 'confirmed'
                })
                .graphLookup({
                    from: 'comments',
                    startWith: '_id',
                    connectFromField: '_id',
                    connectToField: 'post',
                    as: 'comments',
                    restrictSearchWithMatch: {
                        isHidden: false
                    }
                })
            if (!post.length) throw { message: 'Post not found' }
            res.status(200).json(post)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
}

export default PostConstroller
