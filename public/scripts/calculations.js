export const getMonthlyPayments = (loan, interest, term) => {
    const months = term * 12;
    const mRate = interest / (12 * 100);
    return (
        (loan * mRate * Math.pow(1.0 + mRate, months)) /
        (Math.pow(1.0 + mRate, months) - 1.0)
    );
};

export const getTotalInterest = (fixedMonthly, loan, interest, term) => {
    const months = term * 12;
    const mRate = interest / (12 * 100);
    let paymentTowards = 0.0,
        totalInterest = 0.0;

    for (let i = 0; i <= months; i++) {
        totalInterest += loan * mRate;
        paymentTowards = fixedMonthly - loan * mRate;
        loan -= paymentTowards;
    }
    return totalInterest;
};

export const getTotalAmountPaid = (loan, totalInterest) => {
    return Number(loan) + Number(totalInterest);
};

export const getAmortizedSchedule = (loan, interest, term) => {
    const fixedMonthly = getMonthlyPayments(loan, interest, term);
    let interest_rate = 0.0;
    let paymentTowards = 0.0;
    let totalInterest = 0.0;
    let totalPaymentTowardLoan = 0.0;

    const mRate = interest / (12 * 100);
    const results = [];

    for (let year = 1; year <= term; year++) {
        for (let month = 1; month <= 12; month++) {
            interest_rate = loan * mRate;
            totalInterest += interest_rate;
            paymentTowards = fixedMonthly - interest_rate;
            totalPaymentTowardLoan += paymentTowards;
            loan -= paymentTowards;

            // add result to array of results so we can print the later
            results.push({
                year: year,
                month: month,
                interest: interest_rate,
                principal: paymentTowards,
                balance: loan,
                totalInterest: totalInterest,
                totalPrincipal: totalPaymentTowardLoan,
            });
        }
    }
    return results;
};
