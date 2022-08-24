'use strict';
(function () {

    angular.module('tribe-app-service', [])
        .factory('tribeAppService', ['$http', function ($http) {
            var getPromise = $http.get('rest/application.json');
            var result = null;

            function buildMap(list, key) {
                var map = {};
                _.each(list, function (item) {
                    map[item[key]] = item;
                });
                return map;
            }

            function normalizeArray(bean) {
                if (bean && !_.isArray(bean)) {
                    return [bean];
                }
                return bean;
            }

            return {
                loadLongDocumentation: function (projectName, callback) {
                    $http.get('rest/long_documentation.json').then(function (resp) {
                        callback(resp.data);
                    });
                },
                whenReady: function (callback) {
                    getPromise.then(function (resp) {
                        var data = resp.data;
                        if (!result) {
                            if (!data.dtoPage) return;
                            var contributors = normalizeArray(data.dtoPage.contributors);
                            _.each(contributors, function (contributor) {
                                contributor.contributions = normalizeArray(contributor.contributions);
                            });
                            contributors = buildMap(contributors, 'login');
                            var projects = normalizeArray(data.dtoPage.projects);
                            _.each(projects, function (project) {
                                project.contributors = _.map(normalizeArray(project.contributors), function (contributor) {
                                    return contributors[contributor.login];
                                });
                                project.tags = normalizeArray(project.tags);
                            });
                            projects = buildMap(projects, 'name');
                            _.each(_.values(contributors), function (contributor) {
                                var commits = 0;
                                _.each(contributor.contributions, function (contribution) {
                                    contribution.project = projects[contribution.project];
                                    commits = commits + contribution.contributions;
                                });
                                contributor.commits = commits;
                            });
                            var pictures = normalizeArray(data.dtoPage.pictures);
                            var tweets = normalizeArray(data.dtoPage.tweets);
                            result = {
                                contributors: contributors,
                                projects: projects,
                                pictures: pictures,
                                tweets: tweets
                            };
                        }
                        window.tribeAppServiceLoaded = true;
                        callback(result);
                    });
                }
            };
        }]);
}());
