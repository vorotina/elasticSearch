(function(){
    var searchApp = angular.module('SearchApp', ['ngRoute', 'templates', 'SearchComponent', 'VacancyComponent']);
    searchApp.config(['$routeProvider',
        function($routeProvider, $routeParams) {
            $routeProvider.
                when('/search', {
                    templateUrl: 'search/search.html',
                    reloadOnSearch: false,
                    controller: 'SearchCtrl',
                    controllerAs: 'vm'
                }).
                when('/vacancy/:id', {
                    templateUrl: 'vacancy/vacancy.html',
                    controller: 'VacancyCtrl',
                    controllerAs: 'vm',
                    css: 'vacancy/main.css',
                    resolve: {
                        vacancy: function ($route, ElasticService) {
                            return ElasticService.vacancy($route.current.params.id);
                        }
                    }
                }).
                otherwise({
                    redirectTo: '/search'
                });
        }]);
})();