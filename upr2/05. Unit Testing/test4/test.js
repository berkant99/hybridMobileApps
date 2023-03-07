let expect = require("chai").expect;
let isSymmetricArr = require("./symmetry").isSymmetric;
describe("Test arr", function () {
    it("should return false for [1,2,4,3,2,1]", function () {
        expect(isSymmetricArr([1, 2, 4, 3, 2, 1])).to.be.false;
    });
});