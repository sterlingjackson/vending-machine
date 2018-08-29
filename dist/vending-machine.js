"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VendingMachine {
    constructor() {
        this.change = {
            quarters: 100,
            dimes: 100,
            nickels: 100,
            pennies: 100
        };
        this.inventory = {};
        this.deposited = 0.00;
    }
    getItem(itemCode) {
        return this.inventory[itemCode] || null;
    }
    deposit(amount) {
        if (amount > 0 && !isNaN(amount)) {
            this.deposited += amount;
        }
        return this.deposited;
    }
    refund() {
        let coins = this.calculateChange(this.deposited);
        this.deposited = 0;
        return coins;
    }
    purchase(itemCode) {
        let item = this.getItem(itemCode);
        // Check if itemCode is valid and if the item is in stock, otherwise return ERROR.
        if (item !== null && item.quantity > 0 && this.deposited >= item.price) {
            let purchase = this.calculateChange(item.price);
            let refund = this.calculateChange(this.deposited - item.price);
            let refundable = this.isChangeAvailable(refund);
            // If customers can use bills we have to check if we can make proper change.
            if (refundable === true) {
                this.deposited -= item.price;
                this.addChange(purchase);
                this.refund();
                return this.dispense(itemCode);
            }
            else {
                this.refund();
                return {
                    errorCode: 'NOTENOUGHCHANGE'
                };
            }
        }
        else if (item !== null && this.deposited < item.price) {
            return {
                errorCode: 'INSUFFICIENTFUNDS'
            };
        }
        else if (item !== null && item.quantity === 0) {
            this.refund();
            return {
                errorCode: 'OUTOFSTOCK'
            };
        }
        else {
            this.refund();
            return {
                errorCode: 'ERROR'
            };
        }
    }
    dispense(itemCode) {
        let item = this.getItem(itemCode);
        item.quantity--;
        return item;
    }
    restock(itemCode, data) {
        this.inventory[itemCode] = data;
    }
    addChange(coins) {
        this.change.quarters += coins.quarters;
        this.change.dimes += coins.dimes;
        this.change.nickels += coins.nickels;
        this.change.pennies += coins.pennies;
        return this.change;
    }
    calculateChange(amount) {
        let coins = {
            quarters: 0,
            dimes: 0,
            nickels: 0,
            pennies: 0
        };
        coins.quarters = Math.floor(amount / 25);
        coins.dimes = Math.floor((amount % 25) / 10);
        coins.nickels = Math.floor((amount % 10) / 5);
        coins.pennies = Math.floor((amount % 5) / 1);
        return coins;
    }
    isChangeAvailable(change) {
        // This is more readable than chaining all four comparisons together and can stop comparisons as soon as a negative match is found.
        if (change.quarters > 0 && this.change.quarters < change.quarters) {
            return false;
        }
        if (change.dimes > 0 && this.change.dimes < change.dimes) {
            return false;
        }
        if (change.nickels > 0 && this.change.nickels < change.nickels) {
            return false;
        }
        if (change.pennies > 0 && this.change.pennies < change.pennies) {
            return false;
        }
        return true;
    }
}
exports.default = VendingMachine;
