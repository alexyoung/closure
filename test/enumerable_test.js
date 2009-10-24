load('test_helper.js');

Riot.context('Enumerable', function() {
  given('an array', function() {
    var a = [1, 2, 3, 4, 5];

    should('collect array', Closure.Enumerable.collect(a, function(n) {
      return n + 1;
    }).toString()).equals('2,3,4,5,6');

    should('loop with each', function() {
      var b = null;
      Closure.Enumerable.each(a, function(n) { b = n; });
      return b;
    }).equals(5);

    should('tail array', Closure.Enumerable.tail(a, 2).toString()).equals('4,5');
    should('take n items', Closure.Enumerable.take(a, 2).toString()).equals('1,2');
  });

  given('a property list', function() {
    var list = { first: '1', second: '2' };
    should('collect items', Closure.Enumerable.map(Closure.Enumerable.toArray(list), function(n) {
      return n[0] + n[1];
    }).toString()).equals('first1,second2');
  });
});

Riot.run();
