load('test_helper.js');

Riot.context('Functions', function() {

  given('a function to curry', function() {
    var add  = function(a, b) { return a + b; },
        add1 = Closure.curry(add, 1);
    should('return expected values', add1(10)).equals(11);
  });

  given('a function to memoize', function() {
    var fibo = Closure.memoize([0, 1], function(recur, n) {
      return recur(n - 1) + recur(n - 2);
    });
    should('return fibonacci numbers', fibo(10)).equals(55);
  });
});

Riot.run();
