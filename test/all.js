#!/usr/bin/env java org.mozilla.javascript.tools.shell.Main -debug
load('test_helper.js');

var runTests = Riot.run;
Riot.run = function(){};

load('class_test.js');
load('enumerable_test.js');

runTests();
