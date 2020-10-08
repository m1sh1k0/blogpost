import { Schema, model } from 'mongoose'
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        },
        text: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 1000
        },
        post: { type: ObjectId, ref: 'Post' },
        isHidden: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model('Comment', CommentSchema)
