import jwt from 'jsonwebtoken'
import User from '../Models/User'

export default async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']
    if (!token)
        return res
            .status(401)
            .json({ message: 'Access denied. No token provided.' })
    try {
        if (token.startsWith('Bearer')) {
            const str = token.substring(7)
            token = str
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded._id)
        if (user) {
            if (!user.isConfirmed) {
                res.status(401).json({
                    message: 'Wait until admin confirms your account'
                })
                return
            }
        } else {
            throw 'error'
        }
        req.user = { _id: decoded._id }
        if (decoded.isAdmin) req.user.isAdmin = decoded.isAdmin
        next()
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token' })
    }
}
