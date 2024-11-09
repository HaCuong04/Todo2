import { ApiError } from '../helpers/ApiError.js'
import { empty0rRows } from '../helpers/utils.js'
import { insertTask, selectAllTasks, removeTask } from '../models/Task.js'

const getTasks = async (req,res,next) => {
    try {
        const result = await selectAllTasks()
        return res.status(200).json(empty0rRows(result))
    }   catch (error) {
        return next(error)
    }
}

const postTask = async (req, res, next) => {
    try {
        console.log('Request Body:', req.body);
        if (!req.body.description || req.body.description.length === 0) {
            return next(new ApiError('Invalid description for task', 400));
        }
        const result = await insertTask(req.body.description);
        return res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
        console.error('Error posting task:', error); 
        return next(new ApiError('Internal Server Error', 500));
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return next(new ApiError('Invalid ID for task', 500));
        }
        const result = await removeTask(id); 
        if (result.rowCount === 0) {
            return next(new ApiError('Task not found', 200));
        }
        return res.status(200).json({ id: id }); 
    } catch (error) {
        console.error('Error deleting task:', error);
        return next(new ApiError('Internal Server Error', 500));
    }
};

export { getTasks, postTask, deleteTask }