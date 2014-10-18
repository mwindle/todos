
// main module for single page todo application
angular.module('todoApp', ['ngResource', 'ui.bootstrap']);

// REST $resource on server for todos
angular.module('todoApp').factory('Todo', ['$resource', function($resource) {
	return $resource('todos/:id', {id:'@_id'});
}]);

// main controller for single page todo application
angular.module('todoApp').controller('TodoCtrl', ['$scope', '$modal', 'Todo', function($scope, $modal, Todo) {
	$scope.todos = Todo.query();
	$scope.completed = [];
	$scope.showCompleted = false;

	// Create a new todo using the provided input title and save it to the server
	$scope.add = function() {
		if($scope.todoInput) {
			new Todo({ title: $scope.todoInput, done: false }).$save().then(function(todo) {
				$scope.todos.push(todo);
				$scope.todoInput = '';
			});
		}
	};

	// Update the provided todo on the server
	$scope.update = function(todo) {
		if(todo) { todo.$save(); }
	};

	// Update the active todo on the server with the new values in the form
	$scope.updateActive = function() {
		if($scope.activeTodo) { $scope.update($scope.activeTodo); }
	};

	// Opens a modal to confirm deletion of the provided todo. Deletes the todo on the server if confirmed. 
	$scope.delete = function(todo) {
		$scope.openDeleteModal(todo, function() {
			var i = $scope.todos.indexOf(todo);
			todo.$delete();
			$scope.setActive();
		});
	};

	// Sets the active todo that the form will edit. Clears the active todo if no arguments provided, which hides the form. 
	$scope.setActive = function(todo) {
		$scope.activeTodo = todo;
	};

	// Executes the provided callback function, cb, when enter is pressed.
	$scope.onEnter = function($event, cb) {
		if($event && $event.keyCode==13) { cb(); }
	};

	// Executes the provided callback function, cb, when escape is pressed.
	$scope.onEsc = function($event, cb) {
		if($event && $event.keyCode==27) { cb(); }
	};

	// Opens a calendar to specify a due date for the active todo
	$scope.openDueDateCalendar = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();
	    $scope.dueDateOpened = true;
  	};

  	// Opens a confirmation modal to prevent accidental todo deletion.
  	$scope.openDeleteModal = function(todo, onOk) {
  		var instance = $modal.open({
  			templateUrl: 'confirmDeleteModal.html',
  			size: 'sm',
  			controller: function($scope) {
  				$scope.ok = function() {
  					if(onOk) { onOk(); }
  					instance.close();
  				};
  				$scope.cancel = function() {
  					instance.dismiss();
  				};
  				$scope.todo = todo;
  			}
  		});
  	};

}]);

