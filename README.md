# 64-todoapp-sweltering-genoveva
create project

To Do List App

Team Members: Jose Chavez, Marquis Parks

Set-up instructions:  
$ npm install        => Install dependencies  
$ pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start  
                     => Start your postgresql server   
$ psql -f todos.sql  => Create database and schema  
$ npm start          => Start node  

API calls
/api/todos        GET    => Return all to-do items  
/api/todos/:id    GET    => Return to-do item with id  
/api/todos        POST   => Add a to-do item {position, item, dotime, done}  
/api/todos/:id    PUT    => Update to-do item with id {... same as above}  
/api/todos/:id    DELETE => Delete to-do item with id  

Example:  
Get all to-do items in database  
http://127.0.0.1:3000/api/todos => returns status, data[], and status message.  

Database todos  
{  
  ID SERIAL PRIMARY KEY -> ID of to-do item  
  position INTEGER      -> to-do position  
  item VARCHAR          -> to-do item  
  dotime TIME          -> to-do time  
  done BOOLEAN          -> to-do done  
}



Goal: http://jsdev.learnersguild.org/goals/64-To_Do_List_App.html
