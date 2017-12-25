var app = angular.module('slagalicaApp', ['ngRoute']);

//This configures the routes and associates each route with a view and a controller
app.config(function ($routeProvider) {
    $routeProvider
        .when('/home',
        {
            controller: 'HomeController',
            templateUrl: '/app/partials/home.html'
        })
        .when('/spojnice',
        {
        	controller: 'SpojniceController',
        	templateUrl: '/app/partials/spojnice.html'
        })
        .otherwise({ redirectTo: '/home' });
});