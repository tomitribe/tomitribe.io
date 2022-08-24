'use strict';
(function () {
    angular.module('tribe-projects', ['tribe-app-service', 'ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/projects', {
                templateUrl: 'app/page-projects.html'
            });
        }])
        .controller('ProjectsController', ['tribeAppService', '$scope',
            function (tribeAppService, $scope) {
                $scope.baseURI = document.baseURI;
                tribeAppService.whenReady(function (data) {
                    $scope.projects = _.values(data.projects);
                });
            }]);
}());
