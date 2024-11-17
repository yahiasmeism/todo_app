const Todo = require('../models/Todo');
const joi = require('joi');


const todoScheme = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    completed: joi.boolean().default(false)
});

const getAllTodos = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
        return res.status(400).json({ error: 'Page and limit must be positive integers' });
    }

    try {
        const todos = await Todo.find().skip(skip).limit(limit);

        const totalTodos = await Todo.countDocuments();

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalTodos / limit),
            totalItems: totalTodos,
            todos: todos
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createTodo = async (req, res) => {
    try {
        const { error } = todoScheme.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const todo = await Todo.create(req.body);
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllTodos,
    createTodo
};
