const isNumber = (value) => {
    return Object.prototype.toString.call(value) === "[object Number]";
};

export const getMonthlyPayments = (loan, interest, term) => {
    if (isNumber(loan) && isNumber(interest) && isNumber(term)) {
        const months = term * 12;
        const mRate = interest / (12 * 100);
        return (
            (loan * mRate * Math.pow(1.0 + mRate, months)) /
            (Math.pow(1.0 + mRate, months) - 1.0)
        );
    } else {
        return -1;
    }
};

export const getTotalInterest = (fixedMonthly, loan, interest, term) => {
    if (
        isNumber(fixedMonthly) &&
        isNumber(loan) &&
        isNumber(interest) &&
        isNumber(term)
    ) {
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
    } else {
        return -1;
    }
};

export const getTotalAmountPaid = (loan, totalInterest) => {
    if (isNumber(loan) && isNumber(totalInterest)) {
        return loan + totalInterest;
    } else {
        return -1;
    }
};

export const getAmortizedSchedule = (extraMonthly = 0, loan, interest, term) => {
    if (isNumber(loan) && isNumber(interest) && isNumber(term) && isNumber(extraMonthly)) {
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

                if ((paymentTowards + extraMonthly) > loan) {
                    paymentTowards = loan;
                    totalPaymentTowardLoan += paymentTowards;
                    loan = 0;
                }
                else {
                    totalPaymentTowardLoan += paymentTowards + extraMonthly;
                    loan -= (paymentTowards + extraMonthly);
                }
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
                if (loan <= 0) {
                    return results;
                }
            }
        }
        return results;
    } else {
        return [];
    }
};

export const getSavingsExtraMonthly = (loan, interest, term, extraMonthly) => {
    if (isNumber(loan) && isNumber(interest) && isNumber(term) && isNumber(extraMonthly)) {
        const fixedMonthly = getMonthlyPayments(loan, interest, term);

        const interest_paid = getTotalInterest(fixedMonthly, loan, interest, term);
        
        let interest_rate = 0.0;
        let paymentTowards = 0.0;
        let totalInterest = 0.0;
        let totalPaymentTowardLoan = 0.0;
        let sumMonths = 0;
        let totalMonths = term * 12;
        const mRate = interest / (12 * 100);
        const results = [];

        for (let year = 1; year <= term; year++) {
            for (let month = 1; month <= 12; month++) {
                interest_rate = loan * mRate;
                totalInterest += interest_rate;
                paymentTowards = fixedMonthly - interest_rate;
                totalPaymentTowardLoan += paymentTowards + extraMonthly;

                if ((paymentTowards + extraMonthly) > loan) {
                    paymentTowards = loan;
                    totalPaymentTowardLoan += paymentTowards;
                    loan = 0;
                }
                else
                    loan -= (paymentTowards + extraMonthly);

                // add result to array of results so we can print the later
                
                if (loan <= 0) {
                    results.push({
                        years: ((totalMonths - sumMonths) / 12),
                        interest: interest_paid - totalInterest,
                    });
                    return results;
                }
                sumMonths++;
            }
        }
        return results;
    } else {
        return [];
    }
};
