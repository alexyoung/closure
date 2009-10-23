if (typeof load !== 'undefined') {
  load('riot/riot.js');
  load('../closure.js');
}

Riot.context('Enumerable', function() {
  given('an array', function() {
    var a = [1, 2, 3, 4, 5];

    should('collect items', Closure.Enumerable.collect(a, function(n) {
      return n + 1;
    }).toString()).equals('2,3,4,5,6');

    should('loop with each', function() {
      var b = null;
      Closure.Enumerable.each(a, function(n) { b = n; });
      return b;
    }).equals(5);
  });
});

Riot.run();

