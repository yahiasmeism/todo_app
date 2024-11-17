const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const verifyJWT = require('../middlewares/verifyJWT');
const { route } = require('./api');


router.use(verifyJWT);
router.route('/todos').get(todoController.getAllTodos);
router.route('/todos').post(todoController.createTodo);
router.route('/todos/:id').delete(todoController.deleteTodo);
router.route('/todos/:id').put(todoController.updateTodo);


module.exports = router;