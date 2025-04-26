(function() {
    'use strict';
    
    angular
        .module('naturalFoodsApp', ['pascalprecht.translate'])
        .constant('API_CONFIG', {
            baseUrl: 'https://service2.funifier.com/v3',
            token: 'eyJhbGciOiJIUzUxMiIsImNhbGciOiJHWklQIn0.H4sIAAAAAAAAAD2LwQoCIRgGXyU8e2j9TaN7EHTsAeJb_RcESVG3WqJ3zwr2NgwzL4EczryIgzD77ejZQZGyk9UTgSwYLKSoLmXuSWH4K2KUm0cJjf_oOfLKaBhRvw-cS_Ot9et4WU7uXrqbK5dVpC4CejBYvTOkSBsp-Jl_wiiygzbvD3ZQkXOgAAAA.FR3y3sWGfdtXObKzZPPuLUAkIhbYeNuWG5ukclGbGPIP-hZXpXwbut0U0xodQqIslfqN0As2-oLukYnzsbkZZA'
        })
        .run(['$rootScope', '$translate', function($rootScope, $translate) {
            // Set current language in root scope for use in templates
            $rootScope.currentLanguage = $translate.preferredLanguage();
            
            // Function to change language
            $rootScope.changeLanguage = function(langKey) {
                $translate.use(langKey);
                $rootScope.currentLanguage = langKey;
                localStorage.setItem('userLanguage', langKey);
            };
        }]);
})();