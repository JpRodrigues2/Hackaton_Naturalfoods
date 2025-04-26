angular.module('literalCafeApp')
.controller('PrizzesController', function($scope, $http) {
    $scope.currentPage = window.location.pathname.split('/').pop();
    $scope.navigateTo = function(page) {
        window.location.href = page;
    };
    $scope.playerName = "joaopedro";
    $scope.userCoins = 200;
    $scope.availableItems = [];
    $scope.purchasedItems = [];
    $scope.loading = true;
    $scope.error = false;
    $scope.errorMessage = "";
    $scope.showPurchaseModal = false;
    $scope.selectedItem = null;
    $scope.processingPurchase = false;
    $scope.purchaseSuccess = false;
    const authToken = 'Bearer ' + (localStorage.getItem('auth') || '');
    $scope.getPrice = function(item) {
        if (item && item.requires && Array.isArray(item.requires)) {
            for (var i = 0; i < item.requires.length; i++) {
                var req = item.requires[i];
                var itemName = req.item ? req.item.toLowerCase() : '';
                var currencyName = req.currency ? req.currency.toLowerCase() : '';
                if (itemName === 'moedas' || itemName === 'coins' || currencyName === 'moedas' || currencyName === 'coins') {
                    return req.total;
                }
            }
        }
        return null;
    };
    $scope.confirmPurchase = function(item) {
        if ($scope.userCoins < $scope.getPrice(item)) {
            alert("Você não possui moedas suficientes para adquirir este item.");
            return;
        }
        $scope.selectedItem = item;
        $scope.showPurchaseModal = true;
    };
    $scope.cancelPurchase = function() {
        $scope.showPurchaseModal = false;
        $scope.selectedItem = null;
    };
    $scope.purchaseItem = function() {
        if (!$scope.selectedItem) return;
        $scope.processingPurchase = true;
        var reqData = {
            method: 'POST',
            url: 'https://service2.funifier.com/v3/virtualgoods/purchase',
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json"
            },
            data: {
                "player": $scope.playerName,
                "item": $scope.selectedItem._id,
                "total": 1
            }
        };
        $http(reqData).then(
            function(response) {
                if (response.data && response.data.achievements) {
                    for (var i = 0; i < response.data.achievements.length; i++) {
                        var achievement = response.data.achievements[i];
                        if ((achievement.item === "moedas" || achievement.item === "coins") && achievement.type === 0) {
                            $scope.userCoins += achievement.total;
                        }
                    }
                }
                $scope.purchasedItems.push({
                    name: $scope.selectedItem.name,
                    image: $scope.selectedItem.image.medium.url,
                    id: $scope.selectedItem._id
                });
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
                alert("Erro ao processar a compra. Por favor, tente novamente.");
                $scope.showPurchaseModal = false;
                $scope.processingPurchase = false;
            }
        );
    };
    $scope.loadStoreItems = function() {
        $scope.loading = true;
        $scope.error = false;
        var req = {
            method: 'GET',
            url: 'https://service2.funifier.com/v3/virtualgoods/item',
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json"
            }
        };
        $http(req).then(
            function(response) {
                $scope.loading = false;
                if (response.data && response.data.length > 0) {
                    $scope.availableItems = response.data;
                } else {
                    $scope.error = true;
                    $scope.errorMessage = "Nenhum item disponível na loja.";
                }
            },
            function(error) {
                $scope.loading = false;
                $scope.error = true;
                $scope.errorMessage = "Erro ao carregar itens da loja. Por favor, tente novamente mais tarde.";
            }
        );
    };
    $scope.loadPurchasedItems = function() {
        $scope.purchasedItems = [];
    };
    $scope.loadStoreItems();
    $scope.loadPurchasedItems();
});
