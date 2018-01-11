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
        .when('/skocko',
        {
        	controller: 'SkockoController',
        	templateUrl: '/app/partials/skocko.html'
        })
        .when('/koznazna',
        {
        	controller: 'KoznaznaController',
        	templateUrl: '/app/partials/koznazna.html'
        })
        .when('/asocijacije',
        {
        	controller: 'AsocijacijeController',
        	templateUrl: '/app/partials/asocijacije.html'
        })
        .otherwise({ redirectTo: '/home' });
});