(function() {
  'use strict';
  
  angular
      .module('naturalFoodsApp')
      .controller('DashboardController', DashboardController);
  
  DashboardController.$inject = ['$scope', 'ApiService', '$translate'];
  
  function DashboardController($scope, ApiService, $translate) {
      var vm = this;
      
      // Inicialização de propriedades
      vm.userData = {};
      vm.featuredActivities = [];
      vm.upcomingEvents = [];
      vm.showUserMenu = false;
      
      // Métodos expostos
      vm.toggleUserMenu = toggleUserMenu;
      vm.navigateTo = navigateTo;
      vm.logout = logout;
      vm.translateActivity = translateActivity;
      vm.translateActivityDesc = translateActivityDesc;
      vm.translateEvent = translateEvent;
      vm.translateEventDesc = translateEventDesc;
      vm.translateMonth = translateMonth;
      
      // Inicialização
      activate();
      
      // Funções de tradução para atividades e eventos
      function translateActivity(title) {
          switch(title) {
              case "Eco-friendly Shopping": 
                  return "ECO_FRIENDLY";
              case "Alimentação Saudável": 
              case "Healthy Eating": 
                  return "HEALTHY_EATING";
              case "Feedback do Cliente": 
              case "Customer Feedback": 
                  return "CUSTOMER_FEEDBACK";
              default: 
                  return title;
          }
      }
      
      function translateActivityDesc(title) {
          switch(title) {
              case "Eco-friendly Shopping": 
                  return "ECO_FRIENDLY_DESC";
              case "Alimentação Saudável": 
              case "Healthy Eating": 
                  return "HEALTHY_EATING_DESC";
              case "Feedback do Cliente": 
              case "Customer Feedback": 
                  return "CUSTOMER_FEEDBACK_DESC";
              default: 
                  return "";
          }
      }
      
      function translateEvent(title) {
          switch(title) {
              case "Workshop de Culinária Natural": 
              case "Natural Cooking Workshop": 
                  return "COOKING_WORKSHOP";
              case "Feira de Produtos Orgânicos": 
              case "Organic Products Fair": 
                  return "ORGANIC_FAIR";
              default: 
                  return title;
          }
      }
      
      function translateEventDesc(title) {
          switch(title) {
              case "Workshop de Culinária Natural": 
              case "Natural Cooking Workshop": 
                  return "COOKING_WORKSHOP_DESC";
              case "Feira de Produtos Orgânicos": 
              case "Organic Products Fair": 
                  return "ORGANIC_FAIR_DESC";
              default: 
                  return "";
          }
      }
      
      // Traduzir nomes de meses
      function translateMonth(month) {
          var months = {
              'Jan': { en: 'Jan', es: 'Ene' },
              'Fev': { en: 'Feb', es: 'Feb' },
              'Mar': { en: 'Mar', es: 'Mar' },
              'Abr': { en: 'Apr', es: 'Abr' },
              'Mai': { en: 'May', es: 'May' },
              'Jun': { en: 'Jun', es: 'Jun' },
              'Jul': { en: 'Jul', es: 'Jul' },
              'Ago': { en: 'Aug', es: 'Ago' },
              'Set': { en: 'Sep', es: 'Sep' },
              'Out': { en: 'Oct', es: 'Oct' },
              'Nov': { en: 'Nov', es: 'Nov' },
              'Dez': { en: 'Dec', es: 'Dic' }
          };
          
          var currentLang = $translate.use();
          if (months[month] && months[month][currentLang]) {
              return months[month][currentLang];
          }
          return month;
      }
      
      function activate() {
          console.log('Inicializando dashboard...');
          console.log('userId armazenado:', localStorage.getItem('userId'));
          console.log('token disponível:', localStorage.getItem('userToken') ? 'Sim' : 'Não');
          
          loadUserData();
          loadFeaturedActivities();
          loadUpcomingEvents();
          
          // Fecha o menu do usuário quando clica fora
          document.addEventListener('click', function(event) {
              if (!event.target.closest('.avatar') && vm.showUserMenu) {
                  vm.showUserMenu = false;
                  $scope.$apply();
              }
          });
      }
      
      function loadUserData() {
          // Get userId from localStorage
          var userId = localStorage.getItem('userId');
          var userToken = localStorage.getItem('userToken');
          
          // Verificar se temos tanto userId quanto token
          if (!userId || !userToken) {
              console.error('Usuário não autenticado ou sessão expirada.');
              // Redirect to login if no userId or token
              window.location.href = 'login.html';
              return;
          }
          
          ApiService.getPlayerStatus(userId)
              .then(function(data) {
                  vm.userData = data;
                  console.log('Dados do usuário carregados com sucesso:', data);
              })
              .catch(function(error) {
                  console.error('Erro ao carregar dados do usuário:', error);
                  // Fallback data apenas para demonstração visual
                  vm.userData = {
                      "name": "Usuário Natural Foods",
                      "total_points": 100,
                      "pointCategories": {
                          "moedas": 100
                      }
                  };
                  
                  // Se receber erro 401 (não autorizado), voltar para o login
                  if (error && error.status === 401) {
                      console.error('Token expirado ou inválido, redirecionando para login');
                      logout(); // Chama a função de logout para limpar os dados
                  }
              });
      }
      
      function loadFeaturedActivities() {
          ApiService.getFeaturedActivities()
              .then(function(data) {
                  vm.featuredActivities = data;
              })
              .catch(function(error) {
                  console.error('Erro ao carregar atividades em destaque:', error);
              });
      }
      
      function loadUpcomingEvents() {
          ApiService.getUpcomingEvents()
              .then(function(data) {
                  vm.upcomingEvents = data;
              })
              .catch(function(error) {
                  console.error('Erro ao carregar próximos eventos:', error);
              });
      }
      
      function toggleUserMenu() {
          vm.showUserMenu = !vm.showUserMenu;
      }
      
      function navigateTo(page) {
          window.location.href = page;
      }
      
      function logout() {
          localStorage.removeItem('userId');
          localStorage.removeItem('userToken');
          // Usando caminho absoluto para garantir que a navegação funcione
          window.location.href = '../views/login.html';
      }
  }
})();