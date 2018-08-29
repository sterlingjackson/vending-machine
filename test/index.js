const expect = require('chai').expect;
const assert = expect.assert;
const VendingMachine = require('../dist/vending-machine.js').default;

describe("Vending Machine", function() {
  it("An instance of the VendingMachine class should exist.", function(done) {
    let vm = new VendingMachine();

    expect(vm).to.be.an('object');
    done();
  });

  it("The deposit method should return the correct balance.", function(done) {
    let vm = new VendingMachine();

    expect(vm.deposit(100)).to.equal(100);
    expect(vm.deposit(75)).to.equal(175);
    done();
  });

  it("The deposit method should not accept invalid values.", function(done) {
    let vm = new VendingMachine();

    expect(vm.deposit(-100)).to.equal(0);
    expect(vm.deposit('XYZ')).to.equal(0);
    done();
  });

  it("The refund method should issue the correct coins and set deposited to zero.", function(done) {
    let vm = new VendingMachine();
    let coins = {};

    expect(vm.deposit(100)).to.equal(100);
    coins = vm.refund(vm.deposited);
    expect(coins.quarters).to.equal(4);
    expect(coins.dimes).to.equal(0);
    expect(coins.nickels).to.equal(0);
    expect(coins.pennies).to.equal(0);
    expect(vm.deposited).to.equal(0);
    done();
  });

  it("The calculateChange method should return the correct change.", function(done) {
    let vm = new VendingMachine();
    vm.deposit(165);

    expect(vm.calculateChange(vm.deposited).quarters).to.equal(6);
    expect(vm.calculateChange(vm.deposited).dimes).to.equal(1);
    expect(vm.calculateChange(vm.deposited).nickels).to.equal(1);
    done();
  });

  it("The stockInventory method should add products.", function(done) {
    let vm = new VendingMachine();

    addInventory(vm);

    expect(vm.getItem('001').name).to.equal('Dr Pepper');
    expect(vm.getItem('002').quantity).to.equal(10);
    expect(vm.getItem('003').price).to.equal(100);
    expect(Object.keys(vm.inventory).length).to.equal(3);
    done();
  });

  it("The dispense method should update available inventory.", function(done) {
    let vm = new VendingMachine();

    addInventory(vm);
    vm.dispense('001');
    vm.dispense('003');
    vm.dispense('003');

    expect(vm.getItem('001').quantity).to.equal(9);
    expect(vm.getItem('002').quantity).to.equal(10);
    expect(vm.getItem('003').quantity).to.equal(8);
    done();
  });

  it("The purchase method should not accept invalid products.", function(done) {
    let vm = new VendingMachine();

    addInventory(vm);
    vm.deposit(300);

    expect(vm.purchase('007').errorCode).to.equal('ERROR');
    done();
  });

  it("The purchase method should issue refund if item is out of stock.", function(done) {
    let vm = new VendingMachine();

    addInventory(vm);
    vm.restock('003', { name: 'Coca Cola', quantity: 0, price: 100 });
    vm.deposit(300);

    expect(vm.purchase('003').errorCode).to.equal('OUTOFSTOCK');
    done();
  });

  it("The purchase method should issue an error if deposited funds are insufficient.", function(done) {
    let vm = new VendingMachine();

    addInventory(vm);
    vm.deposit(50);

    expect(vm.purchase('001').errorCode).to.equal('INSUFFICIENTFUNDS');
    expect(vm.deposited).to.equal(50);
    done();
  });

  it("The purchase method should issue an error if it can't refund correct change.", function(done) {
    let vm = new VendingMachine();

    addInventory(vm);
    vm.deposit(500);
    vm.change.quarters = 4;

    expect(vm.change.quarters).to.equal(4);
    expect(vm.purchase('001').errorCode).to.equal('NOTENOUGHCHANGE');
    expect(vm.deposited).to.equal(0);
    done();
  });

  it("The purchase method should dispense change after successful purchase.", function(done) {
    let vm = new VendingMachine();

    addInventory(vm);
    vm.deposit(300);

    expect(vm.purchase('001').name).to.equal('Dr Pepper');
    expect(vm.deposited).to.equal(0);
    done();
  });

  it("Coins should be added to stock after successful purchase.", function(done) {
    let vm = new VendingMachine();

    addInventory(vm);
    vm.deposit(300);

    expect(vm.purchase('001').name).to.equal('Dr Pepper');
    expect(vm.change.quarters).to.equal(104);
    done();
  });
});

function addInventory(vm) {
  vm.restock('001', { name: 'Dr Pepper', quantity: 10, price: 100 });
  vm.restock('002', { name: 'Pepsi', quantity: 10, price: 100 });
  vm.restock('003', { name: 'Coca Cola', quantity: 10, price: 100 });
}