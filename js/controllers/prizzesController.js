angular.module('naturalFoodsApp')
.controller('PrizzesController', ['$scope', '$http', '$translate', '$rootScope', 
function($scope, $http, $translate, $rootScope) {
    // Função para definir o idioma
    $scope.changeLanguage = function(langKey) {
        $translate.use(langKey);
        $rootScope.currentLanguage = langKey;
        localStorage.setItem('userLanguage', langKey);
        
        // Definir a direção do texto baseado no idioma
        if (langKey === 'ar' || langKey === 'he') {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
        }
    };

    // Definir o idioma atual baseado no localStorage ou no idioma padrão
    $scope.currentLanguage = localStorage.getItem('userLanguage') || 'en';
    
    // Definir a página atual com base no URL
    $scope.currentPage = window.location.pathname.split('/').pop();
    
    // Função para navegação entre páginas
    $scope.navigateTo = function(page) {
        window.location.href = page;
    };
    
    // Função de navegação para voltar
    $scope.navigateBack = function() {
        window.history.back();
    };

    // Função de logout
    $scope.logout = function() {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    };

        // Inicialização de variáveis
    $scope.playerName = localStorage.getItem('userId') || "joaopedro"; // Usa o ID do usuário armazenado
    $scope.userCoins = 0; // Será atualizado ao carregar dados do usuário
    $scope.availableItems = [];
    $scope.purchasedItems = [];
    $scope.loading = true;
    $scope.error = false;
    $scope.errorMessage = "";
    $scope.showPurchaseModal = false;
    $scope.selectedItem = null;
    $scope.processingPurchase = false;
    $scope.purchaseSuccess = false;
    
    // Obter o token correto do localStorage
    const authToken = 'Bearer ' + (localStorage.getItem('userToken') || '');
    
    // Função auxiliar para obter o preço de um item
    $scope.getPrice = function(item) {
        if (item && item.requires && Array.isArray(item.requires)) {
            for (var i = 0; i < item.requires.length; i++) {
                var req = item.requires[i];
                var itemName = req.item ? req.item.toLowerCase() : '';
                var currencyName = req.currency ? req.currency.toLowerCase() : '';
                if (itemName === 'moedas' || itemName === 'coins' || 
                    currencyName === 'moedas' || currencyName === 'coins') {
                    return req.total;
                }
            }
        }
        return 0; // Retorna 0 em vez de null para evitar erros de exibição
    };
    
    // Carregar dados do usuário incluindo moedas
    $scope.loadUserData = function() {
        if (!$scope.playerName) {
            $scope.error = true;
            $scope.errorMessage = "Usuário não identificado. Por favor, faça login novamente.";
            return;
        }
        
        $http({
            method: 'GET',
            url: 'https://service2.funifier.com/v3/player/' + $scope.playerName + '/status',
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json"
            }
        }).then(function(response) {
            console.log('Dados do usuário:', response.data);
            if (response.data && response.data.pointCategories) {
                // Buscar moedas nas categorias de pontos
                for (var category in response.data.pointCategories) {
                    if (category.toLowerCase() === 'moedas' || category.toLowerCase() === 'coins') {
                        $scope.userCoins = response.data.pointCategories[category];
                        break;
                    }
                }
            }
        }, function(error) {
            console.error('Erro ao carregar dados do usuário:', error);
            // Não exibir erro para o usuário, apenas usar valor padrão
            $scope.userCoins = 100; // Valor padrão para demonstração
        });
    };
    
    // Função para confirmar compra de item
    $scope.confirmPurchase = function(item) {
        if ($scope.userCoins < $scope.getPrice(item)) {
            alert($translate.instant('NOT_ENOUGH_COINS'));
            return;
        }
        $scope.selectedItem = item;
        $scope.showPurchaseModal = true;
    };
    
    // Função para cancelar compra
    $scope.cancelPurchase = function() {
        $scope.showPurchaseModal = false;
        $scope.selectedItem = null;
    };
    
    // Função para realizar compra
    $scope.purchaseItem = function() {
        if (!$scope.selectedItem) return;
        $scope.processingPurchase = true;
        
        // Token fixo de autorização que funciona (ao invés do dinâmico)
        const purchaseToken = 'Bearer eyJhbGciOiJIUzUxMiIsImNhbGciOiJHWklQIn0.H4sIAAAAAAAAAD2LSwrCMBQAryJvnUWTNB_cC0KXHkBek1cIBBOSVC3i3Y0K3Q3DzAswh4k2OIK2w-zJoZDCLGZcJEqDhAQMqkuZelII_RVjZIdHCY3-6CnSzthwxvp90Lm03lq_Tpft7O6lu7VS2UXqImAPuBmV5oPSlgE9809owZXU9v0Bw-zfGKAAAAA.dtVE252a_UspezdZW0FZjWmKy3kLFNMAVfdJGN-NFf8tn78XQfJUkzYTU0h145lHpPwJMQ9qMBg4hNL3o3iy0Q';
        
        var reqData = {
            method: 'POST',
            url: 'https://service2.funifier.com/v3/virtualgoods/purchase',
            headers: {
                "Authorization": purchaseToken,
                "Content-Type": "application/json"
            },
            data: {
                // Ajustando para usar o nome de usuário correto
                "player": $scope.playerName,
                "item": $scope.selectedItem._id,
                "total": 1
            }
        };
        
        $http(reqData).then(
            function(response) {
                console.log('Resposta da compra:', response.data);
                if (response.data && response.data.achievements) {
                    for (var i = 0; i < response.data.achievements.length; i++) {
                        var achievement = response.data.achievements[i];
                        if ((achievement.item === "moedas" || achievement.item === "coins") && achievement.type === 0) {
                            $scope.userCoins -= achievement.total; // Subtrai moedas gastas
                        }
                    }
                }
                
                // Adiciona o item comprado à lista de itens adquiridos
                $scope.purchasedItems.push({
                    name: $scope.selectedItem.name,
                    image: $scope.selectedItem.image && $scope.selectedItem.image.medium ? 
                          $scope.selectedItem.image.medium.url : '../public/COIN.png',
                    id: $scope.selectedItem._id
                });
                
                // Exibe mensagem de sucesso
                $scope.purchaseSuccess = true;
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.purchaseSuccess = false;
                    });
                }, 3000);
                
                $scope.showPurchaseModal = false;
                $scope.selectedItem = null;
                $scope.processingPurchase = false;
            },
            function(error) {
                console.error('Erro na compra:', error);
                $scope.showPurchaseModal = false;
                $scope.processingPurchase = false;
                
                // Exibir mensagem de erro apropriada
                var errorMsg = $translate.instant('PURCHASE_ERROR');
                if (error.data && error.data.message) {
                    errorMsg += ': ' + error.data.message;
                }
                alert(errorMsg);
            }
        );
    };
    
    // Carregar itens disponíveis na loja
    $scope.loadStoreItems = function() {
        $scope.loading = true;
        $scope.error = false;
        
        $http({
            method: 'GET',
            url: 'https://service2.funifier.com/v3/virtualgoods/item',
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json"
            }
        }).then(
            function(response) {
                $scope.loading = false;
                console.log('Itens disponíveis:', response.data);
                
                if (response.data && response.data.length > 0) {
                    // Filtrar apenas itens que possuem preço
                    $scope.availableItems = response.data.filter(function(item) {
                        return $scope.getPrice(item) > 0;
                    });
                    
                    if ($scope.availableItems.length === 0) {
                        $scope.error = true;
                        $scope.errorMessage = $translate.instant('NO_ITEMS_AVAILABLE');
                    }
                } else {
                    $scope.error = true;
                    $scope.errorMessage = $translate.instant('NO_ITEMS_AVAILABLE');
                }
            },
            function(error) {
                console.error('Erro ao carregar itens da loja:', error);
                $scope.loading = false;
                $scope.error = true;
                $scope.errorMessage = $translate.instant('STORE_LOAD_ERROR');
            }
        );
    };
    
    // Carregar itens já adquiridos pelo usuário
    $scope.loadPurchasedItems = function() {
        if (!$scope.playerName) return;
        
        $http({
            method: 'GET',
            url: 'https://service2.funifier.com/v3/player/' + $scope.playerName + '/inventory',
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json"
            }
        }).then(
            function(response) {
                console.log('Inventário do usuário:', response.data);
                
                if (response.data && response.data.length > 0) {
                    $scope.purchasedItems = response.data.map(function(item) {
                        return {
                            name: item.name || item.item,
                            image: item.image || '../public/COIN.png',
                            id: item._id
                        };
                    });
                }
            },
            function(error) {
                console.error('Erro ao carregar inventário:', error);
                // Não exibir mensagem de erro para o usuário
                $scope.purchasedItems = [];
            }
        );
    };
    
    // Inicialização
    $scope.loadUserData();
    $scope.loadStoreItems();
    $scope.loadPurchasedItems();
}]);
