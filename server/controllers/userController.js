import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { insertUser, selectUserByEmail  } from '../models/User.js'
import { ApiError } from '../helpers/ApiError.js'

const { sign } = jwt

const postRegistration = async(req,res,next) => {
    try {
        if (!req.body.email || req.body.email.length === 0) 
            return next(new ApiError('Invalid email for user', 400))
        if (!req.body.password || req.body.password.length < 8) 
            return next(new ApiError('Invalid password for user', 400))
        const userFromDb = await insertUser(req.body.email, hash(req.body.password,10))
        const user = userFromDb.rows[0]
        return res.status(201).json(createUserObject(user.id,user.password))
    }   catch (error) {
        return next(error)
    }
}

const postLogin = async (req, res, next) => {
    const invalid_credentias_message = 'Invalid credentials.'
    try {
        const userFromDb = await selectUserByEmail(req.body.email);
        if (userFromDb.rowsCount === 0) return next(new ApiError(invalid_credentias_message))

        const user = userFromDb.rows[0]
        if (!await compare(req.body.password,user.password)) return next(new ApiError(invalid_credentias_message, 401))

        const token = sign(req.body.email, process.env.JWT_SECRET_KEY)
        return res.status(200).json(createUserObject(user.id, user.email, token))
    }   catch (error) {
        return next(error)
    }
}

const createUserObject = (id,email,token=undefined) => {
    return {
        'id':id, 
        'email':email,
        ...(token !== undefined) && {'token':token}
    }
}

export { postRegistration, postLogin }