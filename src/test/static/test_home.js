describe("main page top header tests", function () {
    beforeEach(module('tribe-controllers-home'));

    it("should scroll three times slower than the whole page", function () {
        inject(function ($controller) {
            const opts = {
                $element: {
                    css: function (value) {
                        expect(JSON.stringify(value)).toBe(JSON.stringify({
                            'transform': 'translateY(1px)'
                        }));
                        done();
                    }
                },
                $window: {}
            };
            $controller('HeaderImageController', opts);
            angular.element(opts.$window).scroll({});
        });

    });
});

describe("highlighted projects tests", function () {
    beforeEach(module('tribe-controllers-home'));

    it("should load data", function () {
        var data = {
            projects: {
                'crest': {
                    name: 'crest',
                    longDescription: 'crest longDescription',
                    snapshot: 'snapshot',
                    icon: 'icon'
                }
            }
        };
        var scope = {};
        inject(function ($controller) {
            $controller('ProjectHighlightController', {
                $scope: scope,
                $sce: {
                    trustAsHtml: function (value) {
                        return 'trusted [' + value + ']'
                    }
                },
                tribeAppService: {
                    whenReady: function (callback) {
                        callback(data);
                    }
                }
            });
        });
        expect(JSON.stringify(scope)).toBe(
            JSON.stringify({
                "highligtedProject": {
                    "name": "crest",
                    "description": "trusted [crest longDescription]",
                    "snapshot": "snapshot",
                    "icon": "icon"
                }
            })
        );
    });
});

describe("projects carousel tests", function () {
    beforeEach(module('tribe-controllers-home'));

    it("should load data", function () {
        var data = {
            projects: {
                'crest': {
                    name: 'crest',
                    longDescription: 'crest longDescription',
                    snapshot: 'snapshot',
                    icon: 'icon'
                }
            }
        };
        var scope = {};
        inject(function ($controller) {
            $controller('ProjectsCarousselController', {
                $scope: scope,
                tribeAppService: {
                    whenReady: function (callback) {
                        callback(data);
                    }
                }
            });
        });
        expect(scope.projects.length).toBe(1);
        expect(scope.projects[0]).toBe(data.projects['crest']);
    });
});
