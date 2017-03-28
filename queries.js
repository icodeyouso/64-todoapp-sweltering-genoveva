var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/todos';
var db = pgp(connectionString);

module.exports = {
  getAllTodos: getAllTodos,
  getTodo: getTodo,
  addTodo: addTodo,
  updateTodo: updateTodo,
  removeTodo: removeTodo
};

function getAllTodos(req, res, next) {
  db.any('select * from items')
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

function getTodo(req, res, next) {
  var itemID = parseInt(req.params.id);
  db.one('select * from items where id = $1', itemID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved one item'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function addTodo(req, res, next) {
  req.body.position = parseInt(req.body.position);
  req.body.dotime = parseInt(req.body.dotime);
  req.body.done = (req.body.done == 'true');
  console.log("req.body", req);
  db.none('insert into items(position, item, dotime, done)' +
      'values(${position}, ${item}, ${dotime}, ${done})', req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one item'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateTodo(req, res, next) {
  req.body.position = parseInt(req.body.position);
  req.body.dotime = parseInt(req.body.dotime);
  req.body.done = (req.body.done == 'true');
  db.none('update items set position=$1, item=$2, dotime=$3, done=$4 where id=$5', [req.body.position, req.body.item, req.body.dotime, req.body.done, parseInt(req.params.id)])
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Updated item'
          });
      })
      .catch(function (err) {
        return next(err);
      });
}

function removeTodo(req, res, next) {
  db.result('delete from items where id = $1', parseInt(req.params.id))
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          /* jshint ignore:start */
          message: `Removed ${result.rowCount} item`
          /* jshint ignore:end */
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
