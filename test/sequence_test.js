load('test_helper.js');

Riot.context('Sequence', function() {
  given('an array', function() {
    var a      = [1, 2, 3, 4, 5],
        seq    = new Closure.Sequence(a),
        mapped = 0;

    should('fetch value at n', seq.at(3)).equals(4);
    should('execute map until the at() value is found', seq.map(function(v) { mapped++; return v; }).at(3)).equals(4);

    should('loop with each', function() {
      var b = null
      seq.each(function(n) { b = n; });
      return b;
    }).equals(5);

    should('collect items', seq.map(function(item) {
      return item + 1;
    }).toString()).equals('2,3,4,5,6');

    should('tail array', seq.tail(2).toArray().toString()).equals('4,5');
    should('tail array twice', seq.tail(3).tail(2).take(1).toString()).equals('4');
    should('take n items', seq.take(2).toString()).equals('1,2');
    should('find items with contains', seq.contains(2)).equals(2);
    should('not match non-existant items with contains', seq.contains(99)).isTypeOf('undefined');

    should('remove items with a function', seq.remove(function(v) { return v === 1 }).toString()).equals('2,3,4,5');
    should('remove items', seq.remove(1).toString()).equals('2,3,4,5');
    should('remove and map items', seq.remove(1).map(function(v) { return v + 1; }).toString()).equals('3,4,5,6');
    should('remove and map and tail', seq.remove(1).map(function(v) { return v + 1; }).tail(2).toString()).equals('5,6');
    should('remove and map and tail and take', seq.remove(1).map(function(v) { return v + 1; }).tail(2).take(1).toString()).equals('5');
    should('take then remove items', seq.take(3).remove(1).toString()).equals('2,3');
    should('tail then remove items', seq.tail(3).remove(4).toString()).equals('3,5');
  });
});

Riot.run();
