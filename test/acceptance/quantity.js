casper.start('http://localhost:3000/', function() {
    this.click('#quantity-plus');
});

casper.then(function() {
    this.test.assertTextExists('You are about to order 2 Banana bread loaves.');
    this.click('#quantity-minus');
});

casper.then(function() {
    this.test.assertTextExists('You are about to order 1 Banana bread loaf.');
});

casper.run(function() {
    this.test.done();
});