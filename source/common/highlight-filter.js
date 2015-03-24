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

