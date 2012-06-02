describe("OrderModel", function() {    
    beforeEach(function() {
        if(!window.alreadyRun) {
            loadFixtures("templates.html");
            bread.initOrderBackbone();
            window.alreadyRun = true;            
        }
    });

    describe("orderText", function() {
        it("should return an empty string if the user chose no components", function() {
            var model = new bread.OrderModel();
            expect(model.orderText()).toEqual("");
        });
        
        it("should return the concatenated components if the user chose some", function() {
            var model = new bread.OrderModel();
            var components = model.get("components");
            components.raisins = true;
            components.walnuts = true;
            components.cinnamon = true;
            model.set("components", components);
            expect(model.orderText()).toEqual(" with <span class='selected-component'>raisins</span>, <span class='selected-component'>walnuts</span> and <span class='selected-component'>cinnamon</span>");
        });
    });
});