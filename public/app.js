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
(function(){

    function ElasticService ($q, $http){

        return {
            search : search,
            vacancy : vacancy
        };

        function search (q, max) {
            return $q(function(resolve, reject){
                $http.get('http://localhost:9200/test-vacancies/vacancy/_search?q=' + encodeURIComponent(q))
                    .success(function(data){
                        if (data.hits.total > max) {
                            reject('too many results.')
                        } else {
                            var result = data.hits.hits
                                .map(function(a) {
                                    a._source._id = a._id;
                                    return a._source;
                                });

                            resolve(result);
                        }
                    })
                    .error(function(data){
                        reject('huston we have a problem!');
                    });
            });
        }

        function vacancy (id) {
            return $q(function(resolve, reject){
                $http.get('http://localhost:9200/test-vacancies/vacancy/' + id)
                    .success(function(data){
                        if (data._source) {
                            resolve(data._source);

                        } else {
                            reject('something was wrong.')
                        }
                    })
                    .error(function(data){
                        reject('huston we have a problem!');
                    });
            });
        }
    }
    ElasticService.$inject = [ '$q', '$http' ];

    angular.module('ElasticComponent', []).service('ElasticService', ElasticService);
})();


(function(){

    function HighlightFilter ($sce) {
        return function(text, phrase) {
            if (text && phrase) {
                var pattern = new RegExp('(' + phrase + ')', 'gi');
                text = text.replace(pattern, '<b class="highlighted">$1</b>')
            }
            return $sce.trustAsHtml(text)
        }
    }
    HighlightFilter.$inject = [ '$sce' ];

    angular.module('Highlighting', []).filter('highlight', HighlightFilter)
})();


(function(){

    function SearchCtrl ($window, $location, ElasticService){
        var vm = this;

        vm.searchText = $location.search().q || '';
        vm.vacancies = [];

        vm.search = function (query){
            window.history.pushState($location.absUrl() + '?q=' + encodeURIComponent(query));

            vm.vacancies = [];
            ElasticService.search(query, 50)
                .then(function (vacancies) {
                    vm.vacancies = vacancies;
                }, function (data) {
                    debugger;
                });
        };
        vm.open = function (vacancy) {
            $location.path('vacancy/' + vacancy._id);
        }
    }
    SearchCtrl.$inject = [ '$window', '$location', 'ElasticService' ];

    angular.module('SearchComponent', ['ElasticComponent', 'Highlighting']).controller('SearchCtrl', SearchCtrl);
})();


(function(){

    function VacancyCtrl (vacancy){
        var vm = this;
        vm.vacancy = vacancy;
    }

    angular.module('VacancyComponent', ['ElasticComponent']).controller('VacancyCtrl', VacancyCtrl);
})();

