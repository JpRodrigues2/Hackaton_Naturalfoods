(function() {
    'use strict';
    
    angular
        .module('naturalFoodsApp')
        .config(['$translateProvider', function($translateProvider) {
            // English translations
            $translateProvider.translations('en', {
                'HELLO': 'Hello',
                'CURRENT_POINTS': 'Current Points',
                'CHALLENGES': 'Challenges',
                'STORE': 'Store',
                'RANKING': 'Ranking',
                'HOME': 'Home',
                'FEATURED_ACTIVITIES': 'Featured Activities This Month',
                'UPCOMING_EVENTS': 'Upcoming Events',
                'PROFILE': 'Profile',
                'SETTINGS': 'Settings',
                'LOGOUT': 'Logout',
                'NO_ACTIVITIES': 'No featured activities at the moment.',
                'NO_EVENTS': 'No scheduled events at the moment.',
                'ECO_FRIENDLY': 'Eco-friendly Shopping',
                'ECO_FRIENDLY_DESC': 'Use reusable bags for your purchases',
                'HEALTHY_EATING': 'Healthy Eating',
                'HEALTHY_EATING_DESC': 'Complete 5 days of balanced eating',
                'CUSTOMER_FEEDBACK': 'Customer Feedback',
                'CUSTOMER_FEEDBACK_DESC': 'Send a suggestion to improve our services',
                'COOKING_WORKSHOP': 'Natural Cooking Workshop',
                'COOKING_WORKSHOP_DESC': 'Learn healthy recipes with our nutritionist',
                'ORGANIC_FAIR': 'Organic Products Fair',
                'ORGANIC_FAIR_DESC': 'Fresh products directly from local producers',
                'POINTS': 'points',
                'COIN': 'Coin',
                'AVAILABLE_REWARDS': 'Available Rewards',
                'REDEEMED_REWARDS': 'Redeemed Rewards',
                'LOADING_ITEMS': 'Loading store items...',
                'PURCHASE_SUCCESS': 'Item successfully purchased!',
                'NO_REDEEMED_ITEMS': 'You haven\'t redeemed any items yet.',
                'CONFIRM_PURCHASE': 'Confirm Purchase',
                'PURCHASE_CONFIRMATION_MESSAGE': 'Do you really want to purchase "{{itemName}}" for {{price}} coins?',
                'CANCEL': 'Cancel',
                'CONFIRM': 'Confirm',
                'PROCESSING': 'Processing...',
                'BUY': 'BUY',
                'NO_ITEMS_AVAILABLE': 'No items available in the store.',
                'NOT_ENOUGH_COINS': 'You don\'t have enough coins to purchase this item.',
                'PURCHASE_ERROR': 'Error processing purchase',
                'STORE_LOAD_ERROR': 'Error loading store items. Please try again later.'
            });
            
            // Spanish translations
            $translateProvider.translations('es', {
                'HELLO': 'Hola',
                'CURRENT_POINTS': 'Puntos Actuales',
                'CHALLENGES': 'Desafíos',
                'STORE': 'Tienda',
                'RANKING': 'Clasificación',
                'HOME': 'Inicio',
                'FEATURED_ACTIVITIES': 'Actividades Destacadas Este Mes',
                'UPCOMING_EVENTS': 'Próximos Eventos',
                'PROFILE': 'Perfil',
                'SETTINGS': 'Configuración',
                'LOGOUT': 'Salir',
                'NO_ACTIVITIES': 'No hay actividades destacadas en este momento.',
                'NO_EVENTS': 'No hay eventos programados en este momento.',
                'ECO_FRIENDLY': 'Compras Ecológicas',
                'ECO_FRIENDLY_DESC': 'Utiliza bolsas reutilizables para tus compras',
                'HEALTHY_EATING': 'Alimentación Saludable',
                'HEALTHY_EATING_DESC': 'Completa 5 días de alimentación balanceada',
                'CUSTOMER_FEEDBACK': 'Comentarios del Cliente',
                'CUSTOMER_FEEDBACK_DESC': 'Envía una sugerencia para mejorar nuestros servicios',
                'COOKING_WORKSHOP': 'Taller de Cocina Natural',
                'COOKING_WORKSHOP_DESC': 'Aprende recetas saludables con nuestra nutricionista',
                'ORGANIC_FAIR': 'Feria de Productos Orgánicos',
                'ORGANIC_FAIR_DESC': 'Productos frescos directamente de productores locales',
                'POINTS': 'puntos',
                'COIN': 'Moneda',
                'AVAILABLE_REWARDS': 'Recompensas Disponibles',
                'REDEEMED_REWARDS': 'Recompensas Canjeadas',
                'LOADING_ITEMS': 'Cargando artículos de la tienda...',
                'PURCHASE_SUCCESS': '¡Artículo comprado con éxito!',
                'NO_REDEEMED_ITEMS': 'Aún no has canjeado ningún artículo.',
                'CONFIRM_PURCHASE': 'Confirmar Compra',
                'PURCHASE_CONFIRMATION_MESSAGE': '¿Realmente deseas comprar "{{itemName}}" por {{price}} monedas?',
                'CANCEL': 'Cancelar',
                'CONFIRM': 'Confirmar',
                'PROCESSING': 'Procesando...',
                'BUY': 'COMPRAR',
                'NO_ITEMS_AVAILABLE': 'No hay artículos disponibles en la tienda.',
                'NOT_ENOUGH_COINS': 'No tienes suficientes monedas para comprar este artículo.',
                'PURCHASE_ERROR': 'Error al procesar la compra',
                'STORE_LOAD_ERROR': 'Error al cargar los artículos de la tienda. Por favor, inténtelo de nuevo más tarde.'
            });
            
            // Set preferred language
            var userLang = localStorage.getItem('userLanguage') || navigator.language || navigator.userLanguage;
            userLang = userLang.split('-')[0]; // Get just the language code (en, es)
            
            // Default to English if not supported
            if (userLang !== 'en' && userLang !== 'es') {
                userLang = 'en';
            }
            
            $translateProvider.preferredLanguage(userLang);
            $translateProvider.useSanitizeValueStrategy('escape');
        }]);
})();