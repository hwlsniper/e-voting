/******************************************************************************
 * e-voting system                                                            *
 * Copyright (C) 2016 DSX Technologies Limited.                               *
 * *
 * This program is free software; you can redistribute it and/or modify       *
 * it under the terms of the GNU General Public License as published by       *
 * the Free Software Foundation; either version 2 of the License, or          *
 * (at your option) any later version.                                        *
 * *
 * This program is distributed in the hope that it will be useful,            *
 * but WITHOUT ANY WARRANTY; without even the implied                         *
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.           *
 * See the GNU General Public License for more details.                       *
 * *
 * You can find copy of the GNU General Public License in LICENSE.txt file    *
 * at the top-level directory of this distribution.                           *
 * *
 * Removal or modification of this copyright notice is prohibited.            *
 * *
 ******************************************************************************/

'use strict';

angular
  .module('e-voting.api-requests', [
    'e-voting.api-requests.api-properties',
    'ngStorage'
  ])
  .config(['$httpProvider', function ($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function (data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data) : data;
    }];
  }])
  .service('apiRequestsUrlHelper', ['serverProperties', 'apiProperties', '$location', function (serverProperties, apiProperties, $location) {
    function constructApiUrl() {
      var serverPort = $location.port();
      serverPort = (!serverProperties.readPortFromUrl || angular.isUndefined(serverPort)) ? ":" + serverProperties.serverPort + "/" : ":" + serverPort + "/";
      return serverProperties.serverUrl + serverPort + serverProperties.pathToApi;
    }

    function constructMethodUrl(methodUrl) {
      return constructApiUrl() + methodUrl;
    }

    return {
      getPostUrl: getPostUrl,
      getCookiePostUrl: getCookiePostUrl
    };

    function getPostUrl(method) {
      if (apiProperties.paths[method] === undefined)
        throw("apiProperties.paths['%s'] is undefined");
      return constructMethodUrl(apiProperties.paths[method]);
    }

    function getCookiePostUrl(method) {
      if (apiProperties.cookiePaths[method] === undefined)
        throw("apiProperties.cookiePaths['%s'] is undefined");
      return constructMethodUrl(apiProperties.cookiePaths[method]);
    }
  }])
  .service('apiRequests', [
    '$q', '$http', '$sessionStorage',
    'apiRequestsUrlHelper', 'notificationInfo', 'notificationEnum',
    function ($q, $http, $sessionStorage, urlHelper, notificationInfo, notificationEnum) {
      /**
       *
       * @param {string} url - request url
       * @param {Object} parameters - request params
       * @param serverSuccessCallback - callback for {response = 200 AND (success = 1 OR no success field <e.g. for marketData requests>}
       * @param serverErrorCallback - callback for {response = 200 AND success = 0). In case of no success is NULL
       * @param finallyCallback - callback for any response
       */
      function sendRequest(url, parameters, serverSuccessCallback, serverErrorCallback, finallyCallback) {
        function onHttpPostSuccess(response) {
          if (angular.isUndefined(response.data.error)) {
            if (!angular.isUndefined(serverSuccessCallback))
              serverSuccessCallback(response.data.result);
          } else {
            if (angular.isUndefined(serverErrorCallback) || serverErrorCallback === null) {
              notificationInfo.setNotification(notificationEnum.errors[response.data.error]);
            } else {
              serverErrorCallback(response.data.error)
            }
          }
        }

        function onHttpPostFail(response) {
        }

        $http.post(url, parameters).then(
          onHttpPostSuccess,
          onHttpPostFail)
          .finally(function () {
            if (!angular.isUndefined(finallyCallback)) {
              finallyCallback();
            }
          });
      }

      function protectedPostRequest(method, parameters, serverSuccessCallback, serverErrorCallback, finallyCallback) {
        var url = urlHelper.getPostUrl(method);
        return sendRequest(url, parameters, serverSuccessCallback, serverErrorCallback, finallyCallback);
      }

      return {
        postRequest: protectedPostRequest,
        postCookieRequest: function (method, parameters, serverSuccessCallback, serverErrorCallback, finallyCallback) {
          if (!angular.isUndefined($sessionStorage.cookie) && $sessionStorage.cookie !== null) {
            var url = urlHelper.getCookiePostUrl(method);
            parameters['cookie'] = $sessionStorage.cookie;
            return sendRequest(url, parameters, serverSuccessCallback, serverErrorCallback, finallyCallback);
          } else {
            var promise = $q.defer();
            promise.reject();
            return promise.promise;
          }
        }
      };
    }
  ]);

