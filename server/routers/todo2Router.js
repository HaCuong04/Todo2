import { Router } from "express"
import { getTasks, postTask, deleteTask } from '../controllers/Taskcontroller.js'

const router = Router()

router.get('/', getTasks)

router.post('/create', postTask)

router.delete('/delete/:id', deleteTask)


export default router