const {
    getMonthlyPayments,
    getTotalInterest,
    getTotalAmountPaid,
    getAmortizedSchedule,
} = require("../public/scripts/calculations");

describe("Calulation Test Cases", () => {
    test("Get Monthly Payment", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const actual = getMonthlyPayments(amount, rate, term);
        const expected = 1610.4648690364193;
        expect(actual).toBe(expected);
    });

    test("Get Total Interest", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const monthlyPayment = getMonthlyPayments(amount, rate, term);
        const actual = getTotalInterest(monthlyPayment, amount, rate, term);
        const expected = 279767.35285310866;
        expect(actual).toBe(expected);
    });

    test("Get Total Amount Paid", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const monthlyPayment = getMonthlyPayments(amount, rate, term);
        const totalInterest = getTotalInterest(
            monthlyPayment,
            amount,
            rate,
            term
        );
        const actual = getTotalAmountPaid(amount, totalInterest);
        const expected = 579767.3528531087;
        expect(actual).toBe(expected);
    });
});
