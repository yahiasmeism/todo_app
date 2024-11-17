const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const verifyJWT = require('../middlewares/verifyJWT');
const { route } = require('./api');


router.use(verifyJWT);
router.route('/').get(todoController.getAllTodos);
router.route('/').post(todoController.createTodo);
route.route('/:id').delete(todoController.deleteTodo);
route.route('/:id').put(todoController.updateTodo);


module.exports = router;