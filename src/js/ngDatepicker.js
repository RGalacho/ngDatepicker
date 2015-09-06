/**
 * ngDatepicker.js - AngularJS Simple Datepicker directive integrated
 *                  with AngularJS translate service.
 *
 * @author RGalacho <https://github.com/RGalacho>
 *
 * Wildly inspired on Jan Kuri's ngDatepicker directive <https://github.com/jkuri/ngDatepicker>
 *
 * Dependencies:
 *   AngularJS >= 1.3.16
 *   Angular-translate >= 2.7.2 (and it's transitive Angular dependencies)
 *   moment.js >= 2.10.3 (with locales)
 *   font-awesome
 *
 * Attributes:
 *   @param {String} format: Model's date format
 *   @param {String} viewFormat: View's date format
 *   @param {String} locale: Force initial calendar locale (optional)
 *   @param {boolean} firstWeekDaySunday: Use sunday as first week day (default false)
 *   @param {String} placeholder: Placeholder text
 *   @param {String} tooltip: Tooltip text
 */
angular.module('rgalacho.translate-datepicker', ['pascalprecht.translate'])

.directive('ngDatepicker', ['$rootScope', '$document', '$translate', function($rootScope, $document, $translate) {
  'use strict';

  var getCurrentLocale = function () {
    return $translate.use().replace(/([a-z]{2})(?:_[A-Z]{2})?/, "$1");
  };

  var setScopeValues = function (scope, attrs) {
    scope.format = attrs.format || 'YYYY-MM-DD';
    scope.viewFormat = attrs.viewFormat || 'Do MMMM YYYY';
    scope.locale = attrs.locale || getCurrentLocale() || 'es';
    scope.firstWeekDaySunday = scope.$eval(attrs.firstWeekDaySunday) || false;
    scope.placeholder = attrs.placeholder || '';
    scope.tooltip = attrs.tooltip || '';
  };

  return {
    restrict: 'EA',
    require: '?ngModel',
    scope: {},
    link: function (scope, element, attrs, ngModel) {
      setScopeValues(scope, attrs);

      scope.calendarOpened = false;
      scope.days = [];
      scope.dayNames = null;
      scope.viewValue = null;
      scope.dateValue = null;

      moment.locale(scope.locale);
      var date = moment();
      var selectedDate = date.clone();

      var generateDayNames = function () {
        var date = scope.firstWeekDaySunday === true ?  moment('2015-06-07') : moment('2015-06-01');

        scope.dayNames = new Array();
        for (var i = 0; i < 7; i += 1) {
          scope.dayNames.push(date.format('ddd'));
          date.add('1', 'd');
        }
      };

      var generateCalendar = function (date, selectedDate) {
        var lastDayOfMonth = date.endOf('month').date(),
            month = date.month(),
            year = date.year(),
            sameMonthAndYear = (selectedDate.year() == date.year()) && (selectedDate.month() == date.month()),
            n = 1;
        var firstWeekDay = scope.firstWeekDaySunday === true ? date.set('date', 2).day() : date.set('date', 1).day();

        if (firstWeekDay !== 1) {
          n -= firstWeekDay - 1;
        }

        scope.dateValue = date.format('MMMM YYYY');
        scope.days = [];

        for (var i = n; i <= lastDayOfMonth; i += 1) {
          if (i > 0) {
            scope.days.push({day: i,
                             month: month + 1,
                             year: year,
                             enabled: true,
                             selected: (sameMonthAndYear && selectedDate.date() == i)});
          } else {
            scope.days.push({day: null,
                             month: null,
                             year: null,
                             enabled: false,
                             selected: false});
          }
        }
        generateDayNames();
      };

      var updateSelectedDate = function (date) {
        selectedDate.date(date.day);
        selectedDate.month((date.month - 1));
        selectedDate.year(date.year);
      };

      scope.showCalendar = function () {
        scope.calendarOpened = true;
        generateCalendar(date, selectedDate);
      };

      scope.closeCalendar = function () {
        scope.calendarOpened = false;
      };

      scope.prevYear = function () {
        date.subtract(1, 'Y');
        generateCalendar(date, selectedDate);
      };

      scope.prevMonth = function () {
        date.subtract(1, 'M');
        generateCalendar(date, selectedDate);
      };

      scope.nextMonth = function () {
        date.add(1, 'M');
        generateCalendar(date, selectedDate);
      };

      scope.nextYear = function () {
        date.add(1, 'Y');
        generateCalendar(date, selectedDate);
      };

      scope.selectDate = function (event, date) {
        event.preventDefault();
        updateSelectedDate(date);
        ngModel.$setViewValue(selectedDate.format(scope.format));
        scope.viewValue = selectedDate.format(scope.viewFormat);
        scope.closeCalendar();
      };

      // if clicked outside of calendar
      var classList = ['ng-datepicker', 'ng-datepicker-input'];
      if (attrs.id !== undefined) classList.push(attrs.id);

      $document.on('click', function (e) {
        if (!scope.calendarOpened) return;

        var i = 0,
          element;

        if (!e.target) return;

        for (element = e.target; element; element = element.parentNode) {
          var id = element.id;
          var classNames = element.className;

          if (id !== undefined) {
            for (i = 0; i < classList.length; i += 1) {
              if (id.indexOf(classList[i]) > -1 || classNames.indexOf(classList[i]) > -1) {
                return;
              }
            }
          }
        }

        scope.closeCalendar();
        scope.$apply();
      });

      $rootScope.$on('$translateChangeSuccess', function (event) {
        scope.locale = getCurrentLocale();
        moment.locale(scope.locale);
        date.locale(scope.locale);
        ngModel.$setViewValue(selectedDate.format(scope.format));
        scope.viewValue = selectedDate.format(scope.viewFormat);
      });

      ngModel.$render = function () {
        var newValue = ngModel.$viewValue;
        scope.viewValue = moment(newValue).format(attrs.viewFormat);
        scope.dateValue = newValue;
      };

    },
    template:
    '<div><input type="text" ng-focus="showCalendar()" ng-value="viewValue" class="input-sm ng-datepicker-input"' +
                ' placeholder="{{ placeholder }} tooltip={{ tooltip }}"></div>' +
    '<div class="ng-datepicker" ng-show="calendarOpened">' +
    '  <div class="controls">' +
    '    <div class="left">' +
    '      <i class="fa fa-backward prev-year-btn" ng-click="prevYear()"></i>' +
    '      <i class="fa fa-angle-left prev-month-btn" ng-click="prevMonth()"></i>' +
    '    </div>' +
    '    <span class="date" ng-bind="dateValue"></span>' +
    '    <div class="right">' +
    '      <i class="fa fa-angle-right next-month-btn" ng-click="nextMonth()"></i>' +
    '      <i class="fa fa-forward next-year-btn" ng-click="nextYear()"></i>' +
    '    </div>' +
    '  </div>' +
    '  <div class="day-names">' +
    '    <span ng-repeat="dn in dayNames">' +
    '      <span>{{ dn }}</span>' +
    '    </span>' +
    '  </div>' +
    '  <div class="calendar">' +
    '    <span ng-repeat="d in days">' +
    '      <span class="day" ng-click="selectDate($event, d)" ng-class="{disabled: !d.enabled, selected: d.selected}">{{ d.day }}</span>' +
    '    </span>' +
    '  </div>' +
    '</div>'
  };

}]);
