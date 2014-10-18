
var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var mongoose = require('mongoose');
var Todo = require('./models/todo');
var app = express();

app.set('port', process.env.PORT || config.get('port'));
app.use(express.static('public'));
app.use(bodyParser.json());

// REST server methods for todo model
// Get all todos
app.get('/todos', function(req, res) {
	Todo.find(function(err, todos) {
		if(err) { res.send(err); }
		res.json(todos);
	});
});
// Create a new todo
app.post('/todos', function(req, res) {
	var todo = new Todo({ title: req.body.title, done: req.body.done });
	todo.save(function(err) {
		if(err) { res.send(err); }
		else { res.json(todo); }
	});
});
// Update an existing todo
app.post('/todos/:id', function(req, res) {
	Todo.findById(req.params.id, function(err, todo) {
		if(err) { res.send(err); }
		todo.done = req.body.done;
		todo.title = req.body.title;
		todo.dueDate = req.body.dueDate;
		todo.description = req.body.description;
		todo.save(function(err) {
			if(err) { res.send(err); }
			else { res.json(todo); }
		});
	});
});
// Delete an existing todo
app.delete('/todos/:id', function(req, res) {
	Todo.remove({ _id: req.params.id }, function(err, todo) {
		if(err) { res.send(err); }
		else { res.json(todo); }
	});
});

// Mongoose MongoDB connection, and associated event handlers
var db = mongoose.connection;
db.on('connecting', function() {
	console.log('Connecting to MongoDB...');
});
db.on('error', function(error) {
	console.error('Error in MongoDb connection: ' + error);
	mongoose.disconnect();
});
db.on('connected', function() {
	console.log('MongoDB connected!');
});
db.once('open', function() {
	console.log('MongoDB connection opened!');
});
db.on('reconnected', function () {
	console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
	console.log('MongoDB disconnected!');
	mongoose.connect(config.get('mongoUrl'), { server: { auto_reconnect: true } });
});
mongoose.connect(config.get('mongoUrl'), { server: { auto_reconnect: true } });

app.listen(app.get('port'), function() {
	console.log('Express server running.');
});
