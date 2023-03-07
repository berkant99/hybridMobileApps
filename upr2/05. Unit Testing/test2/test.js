let expect = require("chai").expect;
let calc = require("./calculator").createCalculator();
describe("Calculator test", function () {
    it("should return 6 for 2+4", function () {
        calc.add(2);
        calc.add(4);
        expect(calc.get()).to.equal(6);
    });
});