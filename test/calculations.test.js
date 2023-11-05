const {
    getMonthlyPayments,
    getTotalInterest,
    getTotalAmountPaid,
    getAmortizedSchedule,
} = require("../public/scripts/calculations");

describe("Calulation Test Cases", () => {
    // confirms getMonthlyPayment properly handles valid data
    test("Get Monthly Payment - Good Data", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const actual = getMonthlyPayments(amount, rate, term);
        const expected = 1610.4648690364193;
        expect(actual).toBe(expected);
    });

    // confirm getMonthlyPayment properly handles bad data
    test("Get Monthly Payment - Bad Data", () => {
        const amount = "BAD_DATA";
        const rate = 5;
        const term = 30;
        const actual = getMonthlyPayments(amount, rate, term);
        const expected = -1;
        expect(actual).toBe(expected);
    });

    // confirms getTotalInterest properly handles valid data
    test("Get Total Interest - Good Data", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const monthlyPayment = getMonthlyPayments(amount, rate, term);
        const actual = getTotalInterest(monthlyPayment, amount, rate, term);
        const expected = 279767.35285310866;
        expect(actual).toBe(expected);
    });

    // confirms getTotalInterest properly handles bad data
    test("Get Total Interest - Bad Data", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const monthlyPayment = getMonthlyPayments(amount, rate, term);
        const badAmount = "BAD_DATA";
        const actual = getTotalInterest(monthlyPayment, badAmount, rate, term);
        const expected = -1;
        expect(actual).toBe(expected);
    });

    // confirms getTotalAmount properly handles valid data
    test("Get Total Amount Paid - Good Data", () => {
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

    // confirms getTotalAmount properly handles bad data
    test("Get Total Amount Paid - Bad Data", () => {
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
        const badAmount = "BAD_DATA";
        const actual = getTotalAmountPaid(badAmount, totalInterest);
        const expected = -1;
        expect(actual).toBe(-1);
    });

    // confirms getAmortizationSchedule properly handles valid data
    test("Get Amortization Schedule - Good Data", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const actual = getAmortizedSchedule(amount, rate, term);
        const expectedLength = 360;

        expect(Array.isArray(actual)).toBe(true);
        expect(actual.length).toBe(expectedLength);
        const actualFirst = actual[0];
        const expectedFirst = {
            year: 1,
            month: 1,
            interest: 1250,
            principal: 360.46486903641926,
            balance: 299639.5351309636,
            totalInterest: 1250,
            totalPrincipal: 360.46486903641926,
        };

        expect(actualFirst.year).toBe(expectedFirst.year);
        expect(actualFirst.month).toBe(expectedFirst.month);
        expect(actualFirst.interest).toBe(expectedFirst.interest);
        expect(actualFirst.principal).toBe(expectedFirst.principal);
        expect(actualFirst.balance).toBe(expectedFirst.balance);
        expect(actualFirst.totalInterest).toBe(expectedFirst.totalInterest);
        expect(actualFirst.totalPrincipal).toBe(expectedFirst.totalPrincipal);
    });

    // confirms getAmortizationSchedule properly handles bad data
    test("Get Amortization Schedule - Bad Data", () => {
        const amount = 300000;
        const rate = 5;
        const term = "BAD_DATA";
        const actual = getAmortizedSchedule(amount, rate, term);
        const expectedLength = 0;

        expect(Array.isArray(actual)).toBe(true);
        expect(actual.length).toBe(expectedLength);
    });
});
