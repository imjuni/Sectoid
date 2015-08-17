(function () {
  'use strict';

  function DateFilter () {
    return function (input) {
      if (input) {
        return moment(new Date(input)).format('HH:mm:ss');
      } else {
        return '';
      }
    };
  }

  function DurationFilter () {
    return function (duration) {
      try {
        if (duration) {
          return _('(%d sec)').sprintf(duration.asSeconds()).value();
        } else {
          return '';
        }
      } catch (err) {
        return '';
      }
    };
  }

  angular.module('services.filters', [])
    .filter('dateFilter', [DateFilter])
    .filter('durationFilter', [DurationFilter]);
})();
