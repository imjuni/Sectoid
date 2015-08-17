(function () {
  'use strict';

  function ReflectionStep () {
    this.name = '';
    this.isStart = false;
    this.diff = 0;
    this.estimate = 0;
    this.duration = [];
  }

  ReflectionStep.prototype.start = function start () {
    this.isStart = true;
    this.duration.push({
      start: new moment(new Date())
    });

    return this;
  };

  ReflectionStep.prototype.end = function end (estimate) {
    this.isStart = false;
    _(this.duration).last().end = new moment(new Date());

    if (estimate === 0 || !estimate) {
      this.diff = (estimate * 60 * 1000) - _.reduce([0].concat(this.duration), function (src, duration) {
          return src + moment.duration(duration.end.diff(duration.start)).asMilliseconds();
        });

      console.log(this.diff);
    }

    return this;
  };

  ReflectionStep.prototype.action = function (estimate) {
    if (this.isStart) {
      this.end(estimate);
    } else {
      this.start();
    }

    return this;
  };

  ReflectionStep.prototype.caption = function caption () {
    return (this.isStart) ? 'Stop' : 'Start';
  };

  ReflectionStep.prototype.getName = function getName () { return this.name; };
  ReflectionStep.prototype.setName = function setName (name) { this.name = name; };

  ReflectionStep.prototype.getIsStart = function getIsStart () { return this.isStart; };
  ReflectionStep.prototype.setIsStart = function setIsStart (isStart) { this.isStart = isStart; };

  ReflectionStep.prototype.getDiff = function getDiff () { return this.diff; };
  ReflectionStep.prototype.setDiff = function setDiff (diff) { this.diff = diff; };

  ReflectionStep.prototype.getDuration = function getDuration () { return this.duration; };

  ReflectionStep.prototype.getTotalDuration = function getTotalDuration () {
    var start = _(this.duration).first().start;
    var end = _(this.duration).last().end;

    return {
      start: start,
      end: end,
      duration: moment.duration(end.diff(start), 'millisecond')
    };
  };

  ReflectionStep.prototype.getDiffWithCurrent = function getDiffWithCurrent () {
    var currentTime = new moment(new Date());

    return {
      current: currentTime,
      duration: moment.duration(currentTime.diff(_(this.duration).last().start), 'millisecond')
    };
  };

  function ReflectionStepService () {
    this.steps = {};
    this.steps.reflection = new ReflectionStep();
    this.steps.directionReview = new ReflectionStep();
    this.steps.gtasksReflection = new ReflectionStep();
    this.steps.achievementsDraw = new ReflectionStep();
    this.steps.roadmapReview = new ReflectionStep();
    this.steps.nextCyclegt = new ReflectionStep();
    this.steps.breakTimeSum = new ReflectionStep();

    this.steps.reflection.name = 'reflection';
    this.steps.directionReview.name = 'directionReview';
    this.steps.gtasksReflection.name = 'gtasksReflection';
    this.steps.achievementsDraw.name = 'achievementsDraw';
    this.steps.roadmapReview.name = 'roadmapReview';
    this.steps.nextCyclegt.name = 'nextCyclegt';
    this.steps.breakTimeSum.name = 'breakTimeSum';
  }

  ReflectionStepService.prototype.getStep = function getStep (name) {
    return this.steps[name];
  };

  ReflectionStepService.prototype.getIdleDuration = function getIdleDuration () {
    var that = this;
    var duration = moment.duration(0, 'millisecond');
    var refDuration = that.steps.reflection.getTotalDuration();

    var totalDuration = _.reduce([duration].concat(_.values(that.steps)), function (src, step) {
      return duration.add(step.getTotalDuration());
    });

    return (moment.duration(refDuration.end.diff(refDuration.start), 'millisecond')).subtract(totalDuration).asMinutes();
  };

  angular.module('services.reflection_step', [])
    .service('_step', [ ReflectionStepService ]);
})();