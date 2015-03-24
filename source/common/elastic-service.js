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

