var koa = require('koa');
var body = require('koa-body');
var serve = require('koa-static');
var views = require('koa-views');
var logger = require('koa-logger');
var Router = require('koa-router');

// Store the todos and the counter
var todos = [];
var count = 0;

// Setup the app
var app = koa();
var router = Router();

// Setup middleware
app.use(body());
app.use(logger());
app.use(serve('assets'));
app.use(views('views', { default: 'ejs' }));
app.use(router.routes());

// Index route
router.get('/', function* (next) {
    yield this.render('index.ejs', {
        todos: todos
    });
});

// New todo route
router.post('/todo', function* (next) {
    var todo = this.request.body.todo;
    todos.push({
        id: count,
        text: todo,
        done: false
    });
    count++;
    this.redirect('/');
});

// Complete todo route
router.get('/complete_todo/:id', function* (next) {
    todos[this.params.id].done = true;
    this.redirect('/');
});

// Start the web server
var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
    console.log('Koa listening on port', port);
});
