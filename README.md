#### ngDatepicker
This is a fork of AngularJS Simple Datepicker directive from Jan Kuri
integrated with translate's locale changing event.

This datepicker update Moment library and value locale when the translate
service broadcast a locale change success event.

Other changes:
  - Added remark of selected date 
  - Added tooltip attribute

#### Dependencies
  - AngularJS >= 1.3.16
  - Angular-translate >= 2.7.2 (and it's transitive Angular dependencies)
  - moment.js >= 2.10.3 (with locales)
  - font-awesome

#### Screenshot
![ScreenShot](https://raw.githubusercontent.com/RGalacho/ngDatepicker/master/screenshot/ngDatepicker.png)

Install
-------

Download or clone this repository.

Include in your page the required CSS and Javascript files:
```html
<link rel="stylesheet" type="text/css" href="src/css/ngDatepicker.css">
<script type="text/javascript" src="src/js/ngDatepicker.min.js"></script>
```

#### Example Configuration
```html
<!DOCTYPE html>
<html ng-app="app">
<head>
  <meta charset="utf-8">
  <title>AngularJS Translate DatePicker</title>
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
  <link rel="stylesheet" type="text/css" href="src/css/ngDatepicker.css">
</head>
<body ng-controller="Ctrl as ctrl">

  <div>
    <h4 translate>{{'BASIC_EXAMPLE'}}</h4>
    <ng-datepicker ng-model="ctrl.date1"></ng-datepicker>
    <span ng-bind="ctrl.date1" style="display: block; margin-top: 5px;">
    </span>
  </div>

  <div>
    <h4 translate>{{'LOCALE_EXAMPLE'}}</h4>
    <ng-datepicker ng-model="ctrl.date2" locale="sl" format="DD.MM.YYYY" view-format="Do MMMM YYYY"></ng-datepicker>
    <span ng-bind="ctrl.date2" style="display: block; margin-top: 5px;">
    </span>
    <input type="button" ng-click="changeLocale('en_UK')" value="English" />
    <input type="button" ng-click="changeLocale('es_ES')" value="Spanish" />
  </div>

  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.2/angular.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.2/angular-sanitize.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-translate/2.7.2/angular-translate.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment-with-locales.min.js"></script>
  <script type="text/javascript" src="src/js/ngDatepicker.js"></script>

  <script type="text/javascript">
    angular.module('app', ['ngSanitize', 'pascalprecht.translate', 'rgalacho.translate-datepicker']);

    angular.module('app').config(function ($translateProvider) {
        $translateProvider.translations('en_UK', {
          'BASIC_EXAMPLE': "Basic example",
          'LOCALE_EXAMPLE': "Example with locale"
        });

        $translateProvider.translations('es_ES', {
          'BASIC_EXAMPLE': "Ejemplo básico",
          'LOCALE_EXAMPLE': "Ejemplo con idioma"
        });

        $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
        $translateProvider.use('en_UK');
    });

    angular.module('app').controller('Ctrl', ['$scope', '$translate', function ($scope, $translate) {
        $scope.changeLocale = function (i18n) {
            $translate.use(i18n);
        };
    }]);
  </script>
</body>
</html>
``` 

