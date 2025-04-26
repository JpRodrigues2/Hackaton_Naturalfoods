var app = angular.module('app', []);

app.controller('RankingController', function($scope, $http) {
  // Set current page for nav highlighting
  $scope.currentPage = window.location.pathname.split('/').pop();
  
  // Navigation function
  $scope.navigateTo = function(page) {
    window.location.href = page;
  };
  
  // Logout function
  $scope.logout = function() {
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    window.location.href = "login.html";
  };
  
  // Loading state
  $scope.loading = true;
  $scope.error = false;
  
  var req = {
    method: 'POST',
    url: 'https://service2.funifier.com/v3/database/team/aggregate',
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsImNhbGciOiJHWklQIn0.H4sIAAAAAAAAAD2LSwrCMBQAryJvnUWTNB_cC0KXHkBek1cIBBOSVC3i3Y0K3Q3DzAswh4k2OIK2w-zJoZDCLGZcJEqDhAQMqkuZelII_RVjZIdHCY3-6CnSzthwxvp90Lm03lq_Tpft7O6lu7VS2UXqImAPuBmV5oPSlgE9809owZXU9v0Bw-zfGKAAAAA.dtVE252a_UspezdZW0FZjWmKy3kLFNMAVfdJGN-NFf8tn78XQfJUkzYTU0h145lHpPwJMQ9qMBg4hNL3o3iy0Q",
      "Content-Type": "application/json"
    },
    data: [
      {
        "$lookup": {
          "from": "achievement",
          "localField": "_id",
          "foreignField": "player",
          "as": "achievements"
        }
      },
      {
        "$addFields": {
          "xp_total": {
            "$sum": {
              "$map": {
                "input": {
                  "$filter": {
                    "input": "$achievements",
                    "as": "ach",
                    "cond": { "$eq": ["$$ach.item", "xp"] }
                  }
                },
                "as": "xp",
                "in": "$$xp.total"
              }
            }
          }
        }
      },
      {
        "$project": {
          "_id": 1,
          "name": 1,
          "image": 1,
          "created": 1,
          "updated": 1,
          "xp_total": 1
        }
      },
      {
        "$setWindowFields": {
          "sortBy": { "xp_total": -1 },
          "output": {
            "rank": {
              "$documentNumber": {}
            }
          }
        }
      },
      {
        "$project": {
          "_id": 1,
          "name": 1,
          "image": "$image.small.url",
          "total": "$xp_total",
          "position": "$rank"
        }
      }
    ]
  };

  $http(req).then(
    function (response) {
      $scope.teams = response.data;
      console.log($scope.teams);
      $scope.loading = false;
      
      // Prepare data for podium display
      if($scope.teams && $scope.teams.length > 0) {
        $scope.topThree = $scope.teams.slice(0, 3);
        $scope.otherTeams = $scope.teams.slice(3);
      }
    },
    function (error) {
      console.error('Erro ao buscar o ranking:', error);
      $scope.loading = false;
      $scope.error = true;
    }
  );
});