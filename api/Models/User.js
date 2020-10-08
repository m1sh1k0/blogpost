import { Schema, model } from 'mongoose'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new Schema(
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
            maxlength: 50,
            unique: true
        },
        accessToken: {
            type: String
        },
        hashedPassword: { type: String, default: '' },
        salt: { type: String, default: '' },
        isAdmin: { type: Boolean, default: false },
        isConfirmed: { type: Boolean, default: false }
    },
    {
        versionKey: false
    }
)

userSchema
    .virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = this.constructor.generateSalt()
        this.hashedPassword = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

userSchema.path('hashedPassword').validate(function () {
    if (this._password) {
        if (typeof this._password === 'string' && this._password.length < 6) {
            this.invalidate('password', 'must be at least 6 characters.')
        }
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
})

userSchema.methods = {
    authenticate(password) {
        return this.encryptPassword(password) === this.hashedPassword
    },

    encryptPassword(password) {
        return this.constructor.encryptPasswordWithSalt(password, this.salt)
    },

    updateAccessToken() {
        this.accessToken = jwt.sign(
            { _id: this._id, isAdmin: this.isAdmin },
            process.env.JWT_SECRET
        )
    },

    signOut() {
        this.updateAccessToken()
        return this.save().then(() => null)
    },
    toJSON() {
        let user = this.toObject()
        delete user.hashedPassword
        delete user.isAdmin
        delete user.salt
        return user
    }
}

userSchema.statics = {
    async signUp(reqBody) {
        const User = this
        delete reqBody.isAdmin
        const exist = await User.load({ criteria: { email: reqBody.email } })
        if (exist) throw { message: 'User with this email already exist' }
        const newUser = new User(reqBody)
        newUser.save()
        return newUser
    },

    signIn(reqBody) {
        const User = this
        return User.load({
            criteria: { email: reqBody.email }
        }).then((user) => {
            if (!user) throw { message: 'Wrong email address' }
            if (!user.authenticate(reqBody.password))
                throw { message: 'Wrong password' }
            user.updateAccessToken()
            user.save()
            return user
        })
    },

    createAdmin(body) {
        const User = this
        body.isAdmin = true
        body.isConfirmed = true
        const admin = new User(body)
        admin.save()
    },

    encryptPasswordWithSalt(password, salt) {
        try {
            return crypto
                .createHmac('sha1', salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            throw { message: err }
        }
    },

    generateSalt() {
        return `${Math.round(new Date().valueOf() * Math.random())}`
    },

    load({ criteria } = {}) {
        return this.findOne(criteria).exec()
    }
}

export default model('User', userSchema)
