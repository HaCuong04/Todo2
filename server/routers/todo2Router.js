import { pool } from '../helpers/db.js'
import { Router } from "express"
//import { empty0rRows } from '../helpers/utils.js'
import { auth } from '../helpers/auth.js'
import { getTasks, postTask } from '../controllers/Taskcontroller.js'

const router = Router()

router.get('/', getTasks)

router.post('/create',postTask)

router.delete('/delete/:id',(req,res,next) => {
    const id = parseInt(req.params.id)
    pool.query('delete from task where id = $1',
        [id],
        (error, result) => {
            if (error) {
                return next(error)
            }
            return res.status(200).json({id: id})
        }
    )
})


export default router