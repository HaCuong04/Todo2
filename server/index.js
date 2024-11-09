import express from 'express'
import cors from 'cors'
import todo2Router from './routers/todo2Router.js'
import userRouter from './routers/userRouter.js'

const port = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/',todo2Router)
app.use('/user',userRouter)

app.listen(port)

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({error: err.message})
})
