angular.module('naturalFoodsApp', [])
.controller('DashboardController', function($scope, $http) {
  $scope.loading = true;
  $scope.error = false;

  var userId = localStorage.getItem('userId');

  var req = {
    method: 'GET',
    url: 'https://service2.funifier.com/v3/player/' + userId + '/status',
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsImNhbGciOiJHWklQIn0.H4sIAAAAAAAAAD2LwQoCIRgGXyU8e2j9TaN7EHTsAeJb_RcESVG3WqJ3zwr2NgwzL4EczryIgzD77ejZQZGyk9UTgSwYLKSoLmXuSWH4K2KUm0cJjf_oOfLKaBhRvw-cS_Ot9et4WU7uXrqbK5dVpC4CejBYvTOkSBsp-Jl_wiiygzbvD3ZQkXOgAAAA.FR3y3sWGfdtXObKzZPPuLUAkIhbYeNuWG5ukclGbGPIP-hZXpXwbut0U0xodQqIslfqN0As2-oLukYnzsbkZZA",
      "Content-Type": "application/json"
    }
  };

  $http(req).then(function(response) {
    $scope.player = response.data;
    $scope.loading = false;
  }, function(error) {
    console.error(error);
    $scope.error = true;
    $scope.loading = false;
  });

  $scope.logout = function() {
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
  }
});
