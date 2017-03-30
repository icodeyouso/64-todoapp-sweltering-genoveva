var express = require('express');
var router = express.Router();

db = require('../queries');

router.use(express.static('public'));
router.get('/api/todos', (req, res, next) => {
  db.getAllTodos()
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all items'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

);

router.get('/api/todos/:id', db.getTodo);
router.post('/api/todos', db.addTodo);
router.put('/api/todos/:id', db.updateTodo);
router.delete('/api/todos/:id', db.removeTodo);

module.exports = router;
