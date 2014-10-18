var mongoose = require('mongoose');

var TodoSchema = new mongoose.Schema({
	title: String,
	done: { type: Boolean, default: false },
	dueDate: Date,
	description: String
});

module.exports = mongoose.model('Todo', TodoSchema);