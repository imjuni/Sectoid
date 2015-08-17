(function () {
  'use strict';

  function config ($compileProvider, $urlRouterProvider, $stateProvider) {
    _.mixin(s.exports());

    $urlRouterProvider.otherwise('/');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|chrome-extension):/);
    $compileProvider.debugInfoEnabled(true);

    $stateProvider
      .state('home', {
        url: '/',
        views : {
          main: {
            templateUrl: '/templates/html/ng_home.html',
            controller: 'HomeCtrl',
            controllerAs: 'homeCtrl'
          }
        },
        resolve: {
          miniReflectionData: ['MiniReflection', function (MiniReflection) {
            return MiniReflection.query().$promise;
          }],
          reflectionData: ['Reflection', function (Reflection) {
            return Reflection.query().$promise;
          }]
        }
      });
  }

  angular.module('sectoid',
    [
      'ngResource',
      'ui.router',
      'controllers.home',
      'services.models',
      'services.filters'
    ])
    .config([
      '$compileProvider',
      '$urlRouterProvider',
      '$stateProvider',
      config
    ]);
})();
