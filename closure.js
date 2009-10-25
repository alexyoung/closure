var Closure = {
  VERSION: '0.0.1',
  Break: {},

  curry: function(fn) {
    var slice = Array.prototype.slice,
        args  = slice.apply(arguments, [1]);
    return function () {
      return fn.apply(null, args.concat(slice.apply(arguments)));
    };
  },

  memoize: function(memo, fn) {
    var wrapper = function(n) {
      var result = memo[n];
      if (typeof result !== 'number') {
        result = fn(wrapper, n);
        memo[n] = result;
      }
      return result;
    };
    return wrapper;
  }
};

/* Classes */
Closure.Class = {
  create: function() {
    var methods = null,
        parent  = undefined,
        klass   = function() { this.initialize.apply(this, arguments); };

    if (typeof arguments[0] === 'function') {
      parent = arguments[0];
      methods = arguments[1];
    } else {
      methods = arguments[0];
    }

    if (typeof parent !== 'undefined')
      Closure.Class.extend(klass.prototype, parent.prototype);

    Closure.Class.mixin(klass, methods);
    Closure.Class.extend(klass.prototype, methods);
    klass.prototype.constructor = klass;

    if (!klass.prototype.initialize)
      klass.prototype.initialize = function(){};

    return klass;
  },

  mixin: function(klass, methods) {
    if (typeof methods.include !== 'undefined') {
      if (typeof methods.include === 'function') {
        Closure.Class.extend(klass.prototype, methods.include.prototype);
      } else {
        for (var i = 0; i < methods.include.length; i++) {
          Closure.Class.extend(klass.prototype, methods.include[i].prototype);
        }
      }
    }
  },

  extend: function(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }
};

/* Sequences */
Closure.Iterator = Closure.Class.create({
  initialize: function(iterator) {
    this.reset();
    this.setIterator(iterator);
  },

  setIterator: function(iterator) {
    if (typeof iterator !== 'undefined') {
      if (typeof iterator === 'function') {
        this.iterator = iterator;
      } else {
        this.iterator = function(v, i) { return iterator[i]; };
      }
    }
  },

  next: function() {
    this.last = this.iterator(this.last, this.index);
    this.index++;
    return this.last;
  },

  reset: function() {
    this.last  = 0;
    this.index = 0;
  },

  slice: function(start, end) {
    var values = [];
    for (var i = 0; i < start; i++) {
      this.next();
    }
    for (var i = start; i < end; i++) {
      values.push(this.next());
    }
    this.last  = 0;
    this.index = 0;
    return values;
  }
});

Closure.Sequence = Closure.Class.create({
  initialize: function(items) {
    if (typeof items === 'function') {
      items = new Closure.Iterator(items);
    }

    this.start     = 0;
    this.end       = items.length;
    this.items     = items;
    this.callbacks = [];
  },

  clone: function() {
    var seq       = new Closure.Sequence(this.items);
    seq.start     = this.start;
    seq.end       = this.end;
    seq.callbacks = [].concat(this.callbacks);
    return seq;
  },

  addCallback: function(callback) {
    this.callbacks.push(callback);
  },

  toString: function() {
    return this.evaluate().toString();
  },

  evaluate: function() {
    var seq = this;
    for (var i = 0; i < this.callbacks.length; i++) {
      seq = this.callbacks[i](seq);
    }
    return seq.items.slice(seq.start, seq.end);
  },

  iterate: function() {
    if (this.iterator) {
      return function () { return this.iterator.next() };
    }

    var seq    = this,
        i      = seq.start - 1,
        getter = function() { return i < seq.start ? null : (i < seq.end ? seq.items[i] : null); };
    return function() { return ++i < seq.end ? getter() : null };
  },

  each: function(callback) {
    for (var i, next = this.iterate(); i = next();) {
      try {
        callback(i);
      } catch (exception) {
        if (exception === Closure.Break) {
          break;
        } else {
          throw exception;
        }
      }
    }
  },

  map: function(callback) {
    var seq = this.clone();
    seq.addCallback(function(s) {
      var values = [];
      s.each(function(value) {
        values.push(callback(value));
      });
      return new Closure.Sequence(values);
    });
    return seq;
  },

  tail: function(n) {
    var seq = this.clone();
    seq.start = this.end - n;
    return seq;
  },

  take: function(n) {
    var seq = this.clone();
    seq.end = seq.start + n;
    return seq;
  },

  first: function() {
    return this.take(1);
  },

  at: function(n) {
    var seq   = this.clone();
    seq.start = n;
    seq.end   = n + 1;
    return seq.evaluate()[0];
  },

  contains: function(value) {
    var contains;
    this.each(function(item) {
      if (item === value) {
        contains = value;
        throw Closure.Break;
      }
    });
    return contains;
  },

  remove: function(callback) {
    var seq = this.clone();
    if (typeof callback !== 'function') {
      var removeValue = callback;
      callback = function(value) { return value === removeValue }; 
    }
    seq.addCallback(function(s) {
      var values = [];
      s.each(function(value) {
        if (callback(value) !== true) {
          values.push(value);
        }
      });
      return new Closure.Sequence(values);
    });
    return seq;
  }
});
Closure.Sequence.prototype.detect  = Closure.Sequence.prototype.contains;
Closure.Sequence.prototype.detect  = Closure.Sequence.prototype.contains;
Closure.Sequence.prototype.toArray = Closure.Sequence.prototype.evaluate;

/* Enumerable */
Closure.Enumerable = {
  iterate: function(iterator) {
    var i      = -1,
        getter = function() { return i < 0 ? null : (i < iterator.length ? iterator[i] : null); };
    return function() { return ++i < iterator.length ? getter() : null };
  },

  each: function(enumerable, callback) {
    for (var i, next = Closure.Enumerable.iterate(enumerable); i = next();) {
      callback(i);
    }
  },

  map: function(enumerable, callback) {
    var newArray = [];
    Closure.Enumerable.each(enumerable, function(value) {
      newArray.push(callback(value));
    });
    return newArray;
  },

  toArray: function(obj) {
    var newArray = [];
    for (var key in obj) {
      newArray.push([key, obj[key]]);
    }
    return newArray;
  },

  tail: function(items, n) {
    return items.slice(items.length - n, items.length);
  },

  take: function(items, n) {
    return items.slice(0, n);
  }
};
Closure.Enumerable.collect = Closure.Enumerable.map;
