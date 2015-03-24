(function(){

    function VacancyCtrl (vacancy){
        var vm = this;
        vm.vacancy = vacancy;
    }

    angular.module('VacancyComponent', ['ElasticComponent']).controller('VacancyCtrl', VacancyCtrl);
})();

