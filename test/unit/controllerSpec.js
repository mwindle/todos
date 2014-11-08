'use strict';

describe('TodoApp Controllers', function() {
	
	beforeEach(module('todoApp'));

	describe('TodoCtrl', function() {
		var $httpBackend, $rootScope, $controller, createController, todoRequestHandler;
		var todos = [
			{_id: "1", title:"Todo 1", done:false, dueDate:new Date(), description:"First todo item"},
			{_id: "2", title:"Todo 2", done:true, dueDate:new Date(), description:"Second todo item"},
			{_id: "3", title:"Todo 3", done:false, dueDate:new Date(), description:"Third todo item"}
		];
		var newTodo = {title:"New Todo", done:false};

		beforeEach(inject(function($injector) {
			$httpBackend = $injector.get('$httpBackend');
			$rootScope = $injector.get('$rootScope');
			$controller = $injector.get('$controller');

			todoRequestHandler = $httpBackend.when('GET', '/todos').respond(todos);

			createController = function() {
				return $controller('TodoCtrl', {$scope: $rootScope});
			};		
		}));

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('should get all todos from the service', function() {
			$httpBackend.expectGET('/todos');
			var controller = createController();
			$httpBackend.flush();
			expect($rootScope.todos.length).toEqual(todos.length);
		});

		it('should handle an empty todo set from the service', function() {
			$httpBackend.expectGET('/todos').respond([]);
			var controller = createController();
			$httpBackend.flush();
			expect($rootScope.todos.length).toEqual(0);
		});

		it('should handle a null set from the service', function() {
			$httpBackend.expectGET('/todos').respond(null);
			var controller = createController();
			$httpBackend.flush();
			expect($rootScope.todos.length).toEqual(0);
		});

		it('should handle a single todo from the service', function() {
			$httpBackend.expectGET('/todos').respond([todos[0]]);
			var controller = createController();
			$httpBackend.flush();
			expect($rootScope.todos.length).toEqual(1);
		});

		it('should not show completed todos by default', function() {
			var controller = createController();
			$httpBackend.flush();
			expect($rootScope.showCompleted).toBe(false);
		});

		it('should not have an active todo by default', function() {
			var controller = createController();
			$httpBackend.flush();
			expect($rootScope.activeTodo).toBe(undefined);
		});

		it('should set the active todo when setActive is called', function() {
			var controller = createController();
			$httpBackend.flush();
			$rootScope.setActive(todos[1]);
			expect($rootScope.activeTodo).toEqual(todos[1]);
		});

		describe('when creating a new todo', function() {
			var cbObj = { cb: function(){} };
			beforeEach(function() {
				$httpBackend.expectPOST('/todos', newTodo).respond(newTodo);
			});
			
			it('should create a new todo on the service with the add method', function() {
				var controller = createController();
				$rootScope.add(newTodo.title);
				$httpBackend.flush();
			});

			it('should create a new todo on the service with the addFromInput method', function() {
				var controller = createController();
				$rootScope.todoInput = newTodo.title;
				$rootScope.addFromInput();
				$httpBackend.flush();
			});

			it('should not create a new todo on the service with the addFromInput method if the input is empty', function() {
				var controller = createController();
				$rootScope.todoInput = "";
				$rootScope.addFromInput();
				$httpBackend.resetExpectations();
				$httpBackend.flush();
			});

			it('should add the new todo to the controller', function() {
				var controller = createController();
				$rootScope.add(newTodo.title);
				$httpBackend.flush();
				expect($rootScope.todos.length).toEqual(todos.length + 1);
			});

			it('should invoke the provided callback when a todo is added', function() {
				var controller = createController();
				spyOn(cbObj, "cb");
				$rootScope.add(newTodo.title, cbObj.cb);
				$httpBackend.flush();
				expect(cbObj.cb).toHaveBeenCalled();
			});

		});

		describe('when updating an existing todo', function() {

			it('should update the existing todo on the service with the update method', function() {
				var controller = createController();
				$httpBackend.flush();

				$rootScope.todos[0].title += " (updated)";
				$httpBackend.expectPOST('/todos/'+todos[0]._id).respond($rootScope.todos[0]);
				$rootScope.update($rootScope.todos[0]);
				$httpBackend.flush();
			});

			it('should update the active todo when updateActive is called', function() {
				var controller = createController();
				$httpBackend.flush();

				$rootScope.setActive($rootScope.todos[1]);
				$rootScope.activeTodo.title += " (updated)";
				$httpBackend.expectPOST('/todos/'+$rootScope.activeTodo._id).respond($rootScope.activeTodo);
				$rootScope.updateActive();
				$httpBackend.flush();				
			});

			it('should not update the active todo when updateActive is called and the active todo is not set', function() {
				var controller = createController();
				$httpBackend.flush();

				spyOn($rootScope, 'update');
				$rootScope.updateActive();
				expect($rootScope.update).not.toHaveBeenCalled();	
			});

		});

		describe('when deleting an existing todo', function() {

			it('should delete the existing todo on the service with the delete method', function() {
				var controller = createController();
				$httpBackend.flush();

				$rootScope.delete($rootScope.todos[1]);
				$httpBackend.expectDELETE('/todos/' + $rootScope.todos[1]._id).respond($rootScope.todos[1]);
				$httpBackend.flush();
			});

		});

	});
});