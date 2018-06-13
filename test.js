function Foo() {
    this.name = "name";
    this.count = 0;
    this.startCounting();
}

Foo.prototype.startCounting = function() {
  var self = this;
  setInterval(function () {        
    console.log(this); // [object Object]
    console.log(this.count); // 1, 2, 3
    this.count++;
  },1000)
}

new Foo();