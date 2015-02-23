(function() {
  'use strict';

  moment.locale('en', {
    calendar: {
      lastDay: '[Yesterday at] LT',
      sameDay: '[Today at] LT',
      nextDay: '[Tomorrow at] LT',
      lastWeek: '[last] dddd [at] LT',
      nextWeek: 'dddd [at] LT',
      sameElse: 'llll'
    }
  });

  angular.module('folc', [])
    .factory('CalendarService', ['$http', '$q', CalendarService])
    .controller('CalendarController', ['CalendarService', CalendarController]);

  function CalendarService($http, $q) {
    return {
      all: all,
      get: get
    };

    function all() {
      return $http.get('https://www.googleapis.com/calendar/v3/calendars/1dondu9lt0u72j5g520l7gt81c%40group.calendar.google.com/events?key=AIzaSyBNZbFXXR3O4HJ_D7fgSbynw6wVPU7OJYc');
    }

    function get() {}
  }

  function CalendarController(CalendarService) {
    var vm = this;

    init();

    function init() {
      return CalendarService.all()
        .then(R.get('data'))
        .then(R.get('items'))
        .then(R.map(function(event) {
          event.start.dateTime = moment(event.start.dateTime);
          event.end.dateTime = moment(event.end.dateTime);
          return event;
        }))
        .then(R.filter(function(event) { return event.start.dateTime.isAfter(); }))
        .then(R.sortBy(R.path('start.dateTime')))
        .then(function(events) { vm.events = events; });
    }
  }

})();
