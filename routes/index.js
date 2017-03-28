var express = require('express');
var router = express.Router();

db = require('../queries');

router.get('/api/todos', db.getAllTodos);
router.get('/api/todos/:id', db.getTodo);
router.post('/api/todos', db.addTodo);
router.put('/api/todos/:id', db.updateTodo);
router.delete('/api/todos/:id', db.removeTodo);

module.exports = router;
