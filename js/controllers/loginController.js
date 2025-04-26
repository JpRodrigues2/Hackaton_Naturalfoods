angular.module('meuApp', []) // Inicializa o app aqui porque o app.js está vazio
.controller('loginController', function($scope, $http) {

    $scope.login = function() {
        var req = {
            method: 'POST',
            url: 'https://service2.funifier.com/v3/auth/token',
            headers: {
                "Authorization": "Basic NjgwYmRlY2EyMzI3Zjc0ZjNhMzdhZWFlOjY4MGMzZmI5MjMyN2Y3NGYzYTM3YzFhNg==",
                "Content-Type": "application/json"
            },
            data: {
                "apiKey": "680bdeca2327f74f3a37aeae",
                "grant_type": "password",
                "username": $scope.username,
                "password": $scope.password
            }
        };

        $http(req).then(
            function(response) {
                console.log(response.data);
                // Salva o token no localStorage
                localStorage.setItem('userToken', response.data.access_token);
                // Redireciona para o Dashboard
                window.location.href = "../views/dashboard.html"; 
            },
            function(error) {
                console.error('Erro no login:', error);
                alert('Login inválido. Por favor, tente novamente.');
            }
        );
    };

});
