let expect = require("chai").expect;
let sum = require("./sum").sum;
describe("sum(arr) - sum elements in arr", function () {
    it("should return 8 for ['2','5','1']", function () {
        expect(sum(['2', '5', '1'])).to.be.equal(8);
    });
});