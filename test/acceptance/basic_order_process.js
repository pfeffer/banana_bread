casper.start('http://localhost:3000/', function() {
    this.click('.order');
});

casper.then(function() {
    this.click('.order');
});

casper.then(function() {
   this.test.assertTextExists('You chose pickup. Order number is');
   this.click('[value="Pay"]');
});

casper.then(function() {
   this.test.assertUrlMatch(/www\.sandbox\.paypal\.com/); 
});

casper.run(function() {
    this.test.done();
});