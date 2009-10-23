var Closure = {
  VERSION: '0.0.1'
};

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
