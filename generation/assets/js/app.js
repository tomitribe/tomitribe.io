(function () {
    'use strict';

    angular.module('tribeio', [
        'tribe-app-directives',
        'tribe-controllers-home',
        'tribe-projects',
        'tribe-contributors',
        'tribe-twitter',
        'tribe-project-details',
        'tribe-project-long-documentation'])
        .config(['$locationProvider', function ($locationProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true
            });
        }])
        .run(function ($rootScope) {
            $rootScope.baseFullPath = angular.element('head base').first().attr('href');
            $rootScope.$on("$routeChangeSuccess", function (event, next) {
                if (!next) return;
                var originalPath = next.originalPath;
                var project = next.params && next.params.project;
                var pageTitle = 'Tomitribe.io - ';
                switch (originalPath) {
                    case "/" :
                        pageTitle += 'Main page';
                        break;
                    case "/projects":
                        pageTitle += 'Projects';
                        break;
                    case "/p/:project":
                    case "/projects/:project":
                        originalPath = originalPath.replace(':project', project);
                        pageTitle += 'Project - ' + project;
                        break;
                    case "/projects/documentation/:project":
                        originalPath = originalPath.replace(':project', project);
                        pageTitle += 'Documentation - ' + project;
                        break;
                    case "/contributors":
                        pageTitle += 'Contributors';
                        break;
                    default :
                        pageTitle += 'Unknown';
                        break;
                }
                var pageEvent = {
                    page_path: originalPath,
                    page_title: pageTitle,
                    page_location: window.location && window.location.href
                };

                if (window['PROD_ENV'] && window['gtag']) {
                    //console.debug({pageEvent: pageEvent});
                    window['gtag']('config', window['GA_ID'], pageEvent);
                } else {
                    //console.debug({pageEvent: pageEvent});
                }
            });
        });
}());
