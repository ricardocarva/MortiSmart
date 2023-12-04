const {
    getMonthlyPayments,
    getTotalInterest,
    getTotalAmountPaid,
    getAmortizedSchedule,
    getSavingsExtraMonthly,
} = require("../public/scripts/calculations");

describe("Calulation Test Cases", () => {
    // confirms getMonthlyPayment properly handles valid data
    test("Get Monthly Payment - Good Data", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const actual = getMonthlyPayments(amount, rate, term);
        const expected = 1610.4648690364193;

        const roundedActual = parseFloat(actual.toFixed(6));
        const roundedExpected = parseFloat(expected.toFixed(6));

        expect(roundedActual).toBe(roundedExpected);
        // expect(actual).toBe(expected);
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
        const roundedActual = parseFloat(actual.toFixed(6));
        const roundedExpected = parseFloat(expected.toFixed(6));

        expect(roundedActual).toBe(roundedExpected);
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
    test("Get Total Amount Paid 2.0 - Good Data", () => {
        const amount = 300000;
        const rate = 5;
        const term = 15;
        const monthlyPayment = getMonthlyPayments(amount, rate, term);
        const totalInterest = getTotalInterest(
            monthlyPayment,
            amount,
            rate,
            term
        );
        const actual = getTotalAmountPaid(amount, totalInterest);
        const expected = 427028.55844;
        const roundedActual = parseFloat(actual.toFixed(6));
        const roundedExpected = parseFloat(expected.toFixed(6));

        expect(roundedActual).toBe(roundedExpected);
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
        const extraMonthly = 0;
        const actual = getAmortizedSchedule(extraMonthly, amount, rate, term);
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
        // Round specific decimal properties to a maximum of 6 decimal places
        const roundedActualPrincipal = parseFloat(actualFirst.principal.toFixed(6));
        const roundedExpectedPrincipal = parseFloat(expectedFirst.principal.toFixed(6));
        const roundedActualTotalInterest = parseFloat(actualFirst.totalInterest.toFixed(6));
        const roundedExpectedTotalInterest = parseFloat(expectedFirst.totalInterest.toFixed(6));
        const roundedActualTotalPrincipal = parseFloat(actualFirst.totalPrincipal.toFixed(6));
        const roundedExpectedTotalPrincipal = parseFloat(expectedFirst.totalPrincipal.toFixed(6));

        // Perform the expectations with rounded values
        expect(actualFirst.year).toBe(expectedFirst.year);
        expect(actualFirst.month).toBe(expectedFirst.month);
        expect(actualFirst.interest).toBe(expectedFirst.interest);
        expect(roundedActualPrincipal).toBe(roundedExpectedPrincipal);
        expect(actualFirst.balance).toBe(expectedFirst.balance);
        expect(roundedActualTotalInterest).toBe(roundedExpectedTotalInterest);
        expect(roundedActualTotalPrincipal).toBe(roundedExpectedTotalPrincipal);
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

    test("Get Amortization Schedule Extra Monthly Payment - Good Data", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const extraMonthly = 300;
        const actual = getAmortizedSchedule(extraMonthly, amount, rate, term);
        const expectedLength = 256;

        expect(Array.isArray(actual)).toBe(true);
        expect(actual.length).toBe(expectedLength);
        const actualFirst = actual[0];
        const expectedFirst = {
            year: 1,
            month: 1,
            interest: 1250,
            principal: 360.46486903641926,
            balance: 299339.5351309636,
            totalInterest: 1250,
            totalPrincipal: 660.46486903641926,
        };

        // Round specific decimal properties to a maximum of 6 decimal places
        const roundedActualPrincipal = parseFloat(actualFirst.principal.toFixed(6));
        const roundedExpectedPrincipal = parseFloat(expectedFirst.principal.toFixed(6));
        const roundedActualTotalInterest = parseFloat(actualFirst.totalInterest.toFixed(6));
        const roundedExpectedTotalInterest = parseFloat(expectedFirst.totalInterest.toFixed(6));
        const roundedActualTotalPrincipal = parseFloat(actualFirst.totalPrincipal.toFixed(6));
        const roundedExpectedTotalPrincipal = parseFloat(expectedFirst.totalPrincipal.toFixed(6));

        // Perform the expectations with rounded values
        expect(actualFirst.year).toBe(expectedFirst.year);
        expect(actualFirst.month).toBe(expectedFirst.month);
        expect(actualFirst.interest).toBe(expectedFirst.interest);
        expect(roundedActualPrincipal).toBe(roundedExpectedPrincipal);
        expect(actualFirst.balance).toBe(expectedFirst.balance);
        expect(roundedActualTotalInterest).toBe(roundedExpectedTotalInterest);
        expect(roundedActualTotalPrincipal).toBe(roundedExpectedTotalPrincipal);
    });

    test("Get Amortization Schedule Extra Monthly Payment Last - Good Data", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const extraMonthly = 300;
        const actual = getAmortizedSchedule(extraMonthly, amount, rate, term);
        const expectedLength = 256;

        expect(Array.isArray(actual)).toBe(true);
        expect(actual.length).toBe(expectedLength);
        const actualLast = actual[expectedLength - 1];
        const expectedLast = {
            year: 22,
            month: 4,
            interest: 3.560376035187331,
            principal: 854.4902484449594,
            balance: 0,
            totalInterest: 188026.59222876708,
            totalPrincipal: 300000.0000000001,
        };

        // Round specific decimal properties to a maximum of 6 decimal places
        const roundedActualInterest = parseFloat(actualLast.interest.toFixed(6));
        const roundedExpectedInterest = parseFloat(expectedLast.interest.toFixed(6));
        const roundedActualPrincipal = parseFloat(actualLast.principal.toFixed(6));
        const roundedExpectedPrincipal = parseFloat(expectedLast.principal.toFixed(6));
        const roundedActualTotalInterest = parseFloat(actualLast.totalInterest.toFixed(6));
        const roundedExpectedTotalInterest = parseFloat(expectedLast.totalInterest.toFixed(6));
        const roundedActualTotalPrincipal = parseFloat(actualLast.totalPrincipal.toFixed(6));
        const roundedExpectedTotalPrincipal = parseFloat(expectedLast.totalPrincipal.toFixed(6));

        // Perform the expectations with rounded values
        expect(actualLast.year).toBe(expectedLast.year);
        expect(actualLast.month).toBe(expectedLast.month);
        expect(roundedActualInterest).toBe(roundedExpectedInterest);
        expect(roundedActualPrincipal).toBe(roundedExpectedPrincipal);
        expect(actualLast.balance).toBe(expectedLast.balance);
        expect(roundedActualTotalInterest).toBe(roundedExpectedTotalInterest);
        expect(roundedActualTotalPrincipal).toBe(roundedExpectedTotalPrincipal);
    });

    test("Get Savings Extra Monthly Payment Last - Good Data", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const extraMonthly = 300;
        const actual = getSavingsExtraMonthly(amount, rate, term, extraMonthly);

        console.log(actual);

        expect(Array.isArray(actual)).toBe(true);
        const actualLast = actual[0];
        const expectedLast = {
            years: 8.75,
            interest: 91740.76062434158,
        };

        const roundedActualInterest = parseFloat(actualLast.interest.toFixed(6));
        const roundedExpectedInterest = parseFloat(expectedLast.interest.toFixed(6));

        expect(actualLast.years).toBe(expectedLast.years);
        expect(roundedActualInterest).toBe(roundedExpectedInterest);
    });

    test("Get Savings Extra Monthly Payment Last 2.0 - Good Data", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const extraMonthly = 450;
        const actual = getSavingsExtraMonthly(amount, rate, term, extraMonthly);

        console.log(actual);

        expect(Array.isArray(actual)).toBe(true);
        const actualLast = actual[0];
        const expectedLast = {
            years: 11.333333333333334,
            interest: 117387.385202,
        };

        const roundedActualInterest = parseFloat(actualLast.interest.toFixed(6));
        const roundedExpectedInterest = parseFloat(expectedLast.interest.toFixed(6));

        expect(actualLast.years).toBe(expectedLast.years);
        expect(roundedActualInterest).toBe(roundedExpectedInterest);
    });


    test("Get Amortization Schedule Extra Monthly is $0 Payment - Good Data", () => {
        const amount = 300000;
        const rate = 5;
        const term = 30;
        const extraMonthly = 0;
        const actual = getAmortizedSchedule(extraMonthly, amount, rate, term);
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

        // Round specific decimal properties to a maximum of 6 decimal places
        const roundedActualPrincipal = parseFloat(actualFirst.principal.toFixed(6));
        const roundedExpectedPrincipal = parseFloat(expectedFirst.principal.toFixed(6));
        const roundedActualTotalInterest = parseFloat(actualFirst.totalInterest.toFixed(6));
        const roundedExpectedTotalInterest = parseFloat(expectedFirst.totalInterest.toFixed(6));
        const roundedActualTotalPrincipal = parseFloat(actualFirst.totalPrincipal.toFixed(6));
        const roundedExpectedTotalPrincipal = parseFloat(expectedFirst.totalPrincipal.toFixed(6));

        // Perform the expectations with rounded values
        expect(actualFirst.year).toBe(expectedFirst.year);
        expect(actualFirst.month).toBe(expectedFirst.month);
        expect(actualFirst.interest).toBe(expectedFirst.interest);
        expect(roundedActualPrincipal).toBe(roundedExpectedPrincipal);
        expect(actualFirst.balance).toBe(expectedFirst.balance);
        expect(roundedActualTotalInterest).toBe(roundedExpectedTotalInterest);
        expect(roundedActualTotalPrincipal).toBe(roundedExpectedTotalPrincipal);
    });
});