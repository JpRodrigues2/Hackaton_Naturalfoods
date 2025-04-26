(function() {
    'use strict';
    
    angular
        .module('naturalFoodsApp')
        .factory('ApiService', ApiService);
    
    ApiService.$inject = ['$http', 'API_CONFIG'];
    
    function ApiService($http, API_CONFIG) {
        var service = {
            getPlayerStatus: getPlayerStatus,
            getFeaturedActivities: getFeaturedActivities,
            getUpcomingEvents: getUpcomingEvents
        };
        
        return service;
        
        function getPlayerStatus(username) {
            return $http({
                method: 'GET',
                url: API_CONFIG.baseUrl + '/player/' + username + '/status',
                headers: {
                    "Authorization": "Bearer " + API_CONFIG.token,
                    "Content-Type": "application/json"
                }
            }).then(function(response) {
                return response.data;
            });
        }
        
        function getFeaturedActivities() {
            // Simulando uma chamada para a API para obter atividades em destaque
            // Em produção, você substituiria isso por uma chamada real para a API Funifier
            return $http({
                method: 'GET',
                url: API_CONFIG.baseUrl + '/challenges/featured',
                headers: {
                    "Authorization": "Bearer " + API_CONFIG.token,
                    "Content-Type": "application/json"
                }
            }).then(function(response) {
                return response.data;
            }).catch(function() {
                // Dados de exemplo para demonstração
                return [
                    {
                        title: "Eco-friendly Shopping",
                        description: "Utilize sacolas retornáveis em suas compras",
                        points: 50,
                        icon: "fas fa-leaf"
                    },
                    {
                        title: "Alimentação Saudável",
                        description: "Complete 5 dias de alimentação balanceada",
                        points: 100,
                        icon: "fas fa-apple-alt"
                    },
                    {
                        title: "Feedback do Cliente",
                        description: "Envie uma sugestão para melhorar nossos serviços",
                        points: 30,
                        icon: "fas fa-comment-dots"
                    }
                ];
            });
        }
        
        function getUpcomingEvents() {
            // Simulando uma chamada para a API para obter eventos futuros
            // Em produção, você substituiria isso por uma chamada real para a API Funifier
            return $http({
                method: 'GET',
                url: API_CONFIG.baseUrl + '/events/upcoming',
                headers: {
                    "Authorization": "Bearer " + API_CONFIG.token,
                    "Content-Type": "application/json"
                }
            }).then(function(response) {
                return response.data;
            }).catch(function() {
                // Dados de exemplo para demonstração
                return [
                    {
                        title: "Workshop de Culinária Natural",
                        description: "Aprenda receitas saudáveis com nossa nutricionista",
                        date: {
                            day: "12",
                            month: "Mai"
                        }
                    },
                    {
                        title: "Feira de Produtos Orgânicos",
                        description: "Produtos frescos diretamente dos produtores locais",
                        date: {
                            day: "20",
                            month: "Mai"
                        }
                    }
                ];
            });
        }
    }
})();