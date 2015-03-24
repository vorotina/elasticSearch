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

