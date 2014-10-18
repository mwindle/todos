todos
=====
A web application for managing your todo list. Not exactly a novel idea at this moment in time. The primary aim of this project is to practice web development with AngularJs backed by a Node.js server. 

## Structure
The client side of the application is built with [AngularJS](https://angularjs.org), with a little help from [Angular's UI Bootstrap](http://angular-ui.github.io/bootstrap) and [Bootstrap](http://getbootstrap.com). 

Files are served up with a [Node.js](http://nodejs.org) server that hosts static content from a public directory. The server also hosts a REST service for managing persisted objects. 

## Developing
Clone this repo
```
git clone https://github.com/mwindle/todos.git
```

You'll need a MongoDB database with a writable user account on it in order to run the application. With those available, create a file called `secrets.js` in the root of the repository with at least the following configuration. 
```
module.exports = {
	mongoUrl: "mongodb://<dbuser>:<dbpassword>@<dbhost>:<dbport>/<dbname>"
};
```

Run the following from a shell with node installed. 
```
npm install
node server
```

Then visit [http://localhost:8000](http://localhost:8000). 

## Todo (no pun intended)
There's still plenty to do in order to make this application sing. 
- Testing. At this moment, it's not good for much without any testing. Need to add client side unit and e2e tests, and unit tests for the server. 
- Beautification. It doesn't look very good at the moment. Need to make it look and work great in mobile and desktop browsers. 
- Robustness. Harden the client and server portions of the application to better handle failure cases. 
- Performance. Resources on the page should be combined and minified where possible. Request counts made by the client need to be kept to a minimum.  