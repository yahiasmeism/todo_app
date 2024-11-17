const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const verifyJWT = require('../middlewares/verifyJWT');
const { route } = require('./api');


router.use(verifyJWT);
router.route('/').get(todoController.getAllTodos);
router.route('/').post(todoController.createTodo);
router.route('/:ids').delete(todoController.deleteTodo);
router.route('/:id').put(todoController.updateTodo);


module.exports = router;