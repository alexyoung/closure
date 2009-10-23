var NoInitializer = Closure.Class.create({
  doSomething: function() { return 'something'; }
});

var User = Closure.Class.create({
  initialize: function(name, age) {
    this.name = name;
    this.age  = age;
  },

  display: function() {
    return this.name + ': ' + this.age;
  },

  login: function() {
    return true;
  }
});

var Admin = Closure.Class.create(User, {
  dangerousMethod: function() {
    return 'danger!';
  }
});

var Guest = Closure.Class.create(User, {
  initialize: function(state) {
    this.name  = 'User_' + this.randomId();
    this.age   = 0;
    this.state = state;
  },

  randomId: function() {
    return Math.floor(Math.random() * 100);
  }
});

var MixinUser = Closure.Class.create({
  include: User,

  initialize: function(log) {
    this.log = log;
  }
});

var DoubleMixinUser = Closure.Class.create({
  include: [NoInitializer, User],

  initialize: function(log) {
    this.log = log;
  }
});
