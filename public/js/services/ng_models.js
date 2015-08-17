(function () {
  'use strict';

  function MiniReflection ($resource) {
    return $resource('data/mini_reflection.json');
  }

  function Reflection ($resource) {
    return $resource('data/reflection.json');
  }

  angular.module('services.models', [])
    .factory('MiniReflection', ['$resource', MiniReflection])
    .factory('Reflection', ['$resource', Reflection]);
})();
