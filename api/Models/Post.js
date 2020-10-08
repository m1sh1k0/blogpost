import { Schema, model } from 'mongoose'
const ObjectId = Schema.Types.ObjectId

const postSchema = new Schema(
    {
        author: { type: ObjectId, ref: 'User' },
        slug: String,
        title: {
            type: String,
            required: true,
            unique: true,
            minlength: 5,
            maxlength: 110
        },
        body: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 2000
        },
        confirm_status: {
            type: String,
            enum: ['pending', 'confirmed', 'rejected'],
            default: 'pending'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

postSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.title) delete this._update.title
    else
        this._update.slug = this._update.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
    if (!this._update.body) delete this._update.body
    next()
})

postSchema.path('title').set(function (title) {
    this.slug = title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
    return title
})

export default model('Post', postSchema)
