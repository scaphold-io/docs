//= require ../lib/_jquery

/*
Copyright 2008-2013 Concur Technologies, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License. You may obtain
a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations
under the License.
*/
(function (global) {
  'use strict';

  // global.getApiUrlFromBrowser = getApiUrlFromBrowser;

  function getApiUrlFromBrowser() {
    var apiUrl = localStorage.getItem("apiUrl");
    if (!apiUrl) {
      apiUrl = "https://us-west-2.api.scaphold.io/graphql/scaphold-graphql";
    }
    return "<code>" + apiUrl + "</code>";
  }

  function getEmailFromBrowser() {
    var email = localStorage.getItem("currentUserEmail");
    if (!email) {
      email = "admin@scaphold.io";
    }
    return "<code>" + email + "</code>";
  }

  global.apiUrl = getApiUrlFromBrowser();
  global.currentUserEmail = getEmailFromBrowser();

})(window);
