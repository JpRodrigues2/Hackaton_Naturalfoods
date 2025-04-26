angular.module('naturalFoodsApp', [])
    .controller('DesafiosController', ['$scope', '$http', function($scope, $http) {
        $scope.challenges = [];
        $scope.loading = true;
        $scope.error = false;
        
        $scope.currentPage = window.location.pathname.split('/').pop();

        $scope.navigateTo = function(page) {
            window.location.href = page;
        };
        $scope.logout = function() {
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            window.location.href = "login.html";
        };
        

        var challengeIcons = {
            'comprar': 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
            'convidar': 'https://cdn-icons-png.flaticon.com/512/2497/2497892.png',
            'compartilhar': 'https://cdn-icons-png.flaticon.com/512/2065/2065062.png',
            'default': 'https://cdn-icons-png.flaticon.com/512/1087/1087927.png'
        };

        $scope.getIconForChallenge = function(challenge) {
            if (challenge.rules && challenge.rules.length > 0) {
                var actionId = challenge.rules[0].actionId;
                if (challenge.challenge.toLowerCase().includes('comprar') || actionId === 'comprar') {
                    return challengeIcons.comprar;
                } else if (challenge.challenge.toLowerCase().includes('convidar') || actionId === 'convidar') {
                    return challengeIcons.convidar;
                } else if (challenge.challenge.toLowerCase().includes('compartilhar') || actionId === 'compartilhar') {
                    return challengeIcons.compartilhar;
                }
            }
            return challengeIcons.default;
        };

        $scope.getRewardPoints = function(challenge) {
            if (challenge.points && challenge.points.length > 0) {
                for (var i = 0; i < challenge.points.length; i++) {
                    if (challenge.points[i].category === 'xp') {
                        return challenge.points[i].total;
                    }
                }
                return challenge.points[0].total;
            }
            return 0;
        };

        var req = {
            method: 'GET',
            url: 'https://service2.funifier.com/v3/challenge',
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsImNhbGciOiJHWklQIn0.H4sIAAAAAAAAAD2LSwrCMBQAryJvnUWTNB_cC0KXHkBek1cIBBOSVC3i3Y0K3Q3DzAswh4k2OIK2w-zJoZDCLGZcJEqDhAQMqkuZelII_RVjZIdHCY3-6CnSzthwxvp90Lm03lq_Tpft7O6lu7VS2UXqImAPuBmV5oPSlgE9809owZXU9v0Bw-zfGKAAAAA.dtVE252a_UspezdZW0FZjWmKy3kLFNMAVfdJGN-NFf8tn78XQfJUkzYTU0h145lHpPwJMQ9qMBg4hNL3o3iy0Q",
                "Content-Type": "application/json"
            }
        };

        $http(req).then(
            function (response) {
                console.log(response.data);
                $scope.challenges = response.data.filter(function(challenge) {
                    return challenge.active;
                });
                $scope.loading = false;
            },
            function (err) {
                console.log(err);
                $scope.error = true;
                $scope.loading = false;
            }
        );
    }]);
