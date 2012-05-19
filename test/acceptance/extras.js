casper.start('http://localhost:3000/', function() {
    this.click('[alt="chocolate chips"]');
});

casper.then(function() {
    this.test.assertTextExists('You are about to order 1 Banana bread loaf with chocolate chips.');
    this.test.assert(this.evaluate(function() { return $("[alt=\"chocolate chips\"]").hasClass("selected"); }));
    this.click('[alt="chocolate chips"]');
});

casper.then(function() {
    this.test.assertTextExists('You are about to order 1 Banana bread loaf.');
    this.test.assertNot(this.evaluate(function() { return $("[alt=\"chocolate chips\"]").hasClass("selected"); }));
    this.click('[alt="chocolate chips"]');    
});

casper.then(function() {
    this.click('.order');
});

casper.then(function() {
    this.test.assertTextExists('You are about to order 1 Banana bread loaf with chocolate chips.');
    this.click('.order');
});

casper.then(function() {
    this.test.assertTextExists('You are about to order 1 Banana bread loaf with chocolate chips.');
});

casper.run(function() {
    this.test.done();
});