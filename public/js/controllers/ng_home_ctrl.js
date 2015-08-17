(function () {
  'use strict';

  function HomeCtrl ($scope, $timeout, $interval, miniReflectionData, reflectionData) {
    var vm = this;

    vm.download = {};
    vm.download.data = '';
    vm.download.target = '_self';
    vm.download.download = 'reflection.csv';

    vm.handle = {};
    vm.handle.stopwatch = null;

    vm.cpation = {};
    vm.cpation.duration = '00:00:00';

    vm.state = {};

    function stopWatchInterval () {
      var end = moment(new Date());

      vm.state.diff = moment.duration(end.diff(vm.state.start));
      vm.cpation.duration = _('%02d:%02d:%02d')
        .sprintf(vm.state.diff.hours(), vm.state.diff.minutes(), vm.state.diff.seconds())
        .value();

      if (vm.state.current !== null && vm.state.current !== undefined) {
        var currentStep = vm.steps[vm.state.current];
        var stamp = _.last(currentStep.stamps);
        var diff = moment.duration(end.diff(stamp.start));

        currentStep.progress = diff.asSeconds() / currentStep.reserved * 100;

        if (currentStep.progress < 101) {
          currentStep.progressStyle = currentStep.progress + '%';
        } else if (currentStep.progress > 100 && currentStep.classes.overflow === '') {
          currentStep.classes.overflow = 'over-flow-time';
        }
      }
    }

    function createState () {
      vm.state.reflection = false;
      vm.state.current = null;
      vm.state.prev = null;
      vm.state.start = null;
      vm.state.end = null;
      vm.state.diff = null;
      vm.state.sum = '';
    }

    function processStep (steps) {
      vm.steps = steps;

      _.forEach(vm.steps, function (step, index) {
        step.id = index;

        step.button = {};
        step.button.start = false;
        step.button.showStart = true;
        step.button.stop = true;
        step.button.showStop = true;

        step.stamps = [];
        step.difference = 0;
        step.sum = 0;
        step.touch = false;
        step.progress = 0;

        step.classes = {};
        step.classes.overflow = '';
        step.progressStyle = '0%';
      });

      vm.steps.push({
        "id": vm.steps.length,
        "name": "Idle Time",
        "reserved": 0,
        "stamps": [],
        "sum": 0,
        "difference": 0,
        "touch": false,
        "noreserved": true,
        "required": false,
        "progress": 0
      });
    }

    vm.onClickMiniReflection = function onClickMiniReflection () {
      createState();
      processStep(_.cloneDeep(miniReflectionData));

      vm.handle.stopwatch = null;
      vm.cpation.duration = '00:00:00';
    };

    vm.onClickReflection = function onClickReflection () {
      createState();
      processStep(_.cloneDeep(reflectionData));

      vm.handle.stopwatch = null;
      vm.cpation.duration = '00:00:00';
    };

    vm.buttonToggle = function buttonToggle (button) {
      button.start = !button.start;
      button.stop = !button.stop;
    };

    vm.onClickStart = function onClickStart ($index) {
      if (!vm.state.start) {
        vm.state.start = moment(new Date());
        vm.handle.stopwatch = $interval(stopWatchInterval, 1000);
      }

      if (vm.state.current !== $index) {
        vm.onClickStop(vm.state.current);
      }

      vm.steps[$index].touch = true;
      vm.steps[$index].stamps.push({
        start: moment(new Date()),
        end: null,
        diff: null
      });

      vm.buttonToggle(vm.steps[$index].button);

      vm.state.reflection = true;
      vm.state.current = $index;
    };

    vm.onClickStop = function onClickStop ($index) {
      if (vm.state.current === null || vm.state.current === undefined) return false;

      vm.buttonToggle(vm.steps[$index].button);

      var currentStep = vm.steps[$index];

      var stamp = _.last(currentStep.stamps);
      stamp.end = moment(new Date());
      stamp.diff = moment.duration(stamp.end.diff(stamp.start));

      var sum = (_.reduce([0].concat(currentStep.stamps), function (sum, stamp) {
        return sum + stamp.diff.asMilliseconds();
      })).toFixed(3);

      currentStep.sum = (sum / 1000).toFixed(3);
      currentStep.difference = currentStep.reserved - currentStep.sum;

      vm.state.current = null;
    };

    vm.onClickStopAll = function onClickStopAll () {
      $interval.cancel(vm.handle.stopwatch);

      if (vm.state.current) {
        vm.onClickStop(vm.state.current);
      }

      vm.state.end = moment(new Date());
      var totalSum = _.reduce([0].concat(vm.steps), function (sum, step) {
        return sum + _.reduce([0].concat(step.stamps), function (stampSum, stamp) {
            return stampSum + stamp.diff.asMilliseconds();
          });
      });

      var idleStep = _.last(vm.steps);
      var duration = moment.duration(vm.state.end.diff(vm.state.start));

      idleStep.sum = duration.asSeconds().toFixed(3);
      vm.state.sum = (totalSum / 1000).toFixed(3);
      vm.state.reflection = false;

      vm.createSummary();
    };

    vm.isEnableStopAll = function isEnableStopAll () {
      return !_.reduce([true].concat(vm.steps), function (src, step) {
        if (step.name === 'Idle Time') {
          return src;
        } else if (step.name === 'Break Time') {
          return src;
        } else {
          return src && step.touch;
        }
      });
    };

    function b64EncodeUnicode (str) {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
      }));
    }

    vm.createSummary = function createSummary () {
      var csv = _.map(vm.steps, function (step) {
        return _.map(step.stamps, function (stamp) {
          return [step.name, step.reserved, step.sum, step.difference, stamp.start.format('YYYY-MM-DD HH:mm:ss.SSS'),
            stamp.end.format('YYYY-MM-DD HH:mm:ss.SSS'),
            stamp.diff.asSeconds().toFixed(3)].join(', ');
        }).join('%0A');
      }).join('%0A');

      csv = ['Name', 'Reserved', 'Sum', 'Difference', 'Start', 'End', 'Duration'].join(', ') + '\n' + csv;
      vm.download.data = 'data:attachment/csv;base64,' + b64EncodeUnicode(csv);

      //$('#download-anchor')[0].target = '_blank';
      //$('#download-anchor')[0].download = 'reflection.csv';
      //
      //$('#download-anchor').trigger('click');
    };

    vm.onClickMiniReflection();
  }

  angular.module('controllers.home', [])
    .controller('HomeCtrl', [
      '$scope',
      '$timeout',
      '$interval',
      'miniReflectionData',
      'reflectionData',
      HomeCtrl]);
})();
