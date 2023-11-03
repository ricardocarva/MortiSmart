import { DEFAULT_RENDER_CONTAINER_ID } from "../constants.js";
import {
    getMonthlyPayments,
    getTotalInterest,
    getTotalAmountPaid,
    getAmortizedSchedule,
} from "../calculations.js";
import { debounce } from "../utils.js";
import { Results } from "./Results.js";
import { ContentHeader } from "./ContentHeader.js";
import { OutputTable } from "./OutputTable.js";
import { Visual } from "./Visual.js";

let amountSet = false;
let rateSet = false;
let termSet = false;
let chart = {};
export const InputForm = {
    loadEventListeners: () => {},
    submitHandler: (e) => {
        e.preventDefault();

        // toggle margin on terms container for better visual flow
        const termsContainer = document.getElementById("terms-container");
        if (termsContainer.classList.contains("m-auto")) {
            termsContainer.classList.remove("m-auto");
            termsContainer.classList.add("m-15");
        }
        const loan = document.getElementById("loanAmount").value;
        const interest = document.getElementById("interestRate").value;
        const term = document.getElementById("loanTerm").value;
        //const extra = document.getElementById("extraPayments").value;
        if (loan && interest && term) {
            const fixedMonthlyPayment = getMonthlyPayments(
                loan,
                interest,
                term
            );

            const totalInterest = getTotalInterest(
                fixedMonthlyPayment,
                loan,
                interest,
                term
            );

            const totalAmountPaid = getTotalAmountPaid(loan, totalInterest);
            const resObj = {
                "Monthly Payment": fixedMonthlyPayment,
                "Total Interest": totalInterest,
                "Total Amount Paid": totalAmountPaid,
            };
            //console.log(resObj, "resObject");

            // clear previous results
            const resultsParent = document.getElementById("results-container");
            while (resultsParent.hasChildNodes()) {
                //if (parent.lastElementChild.classList.contains("results"))
                resultsParent.removeChild(resultsParent.lastChild);
            }

            // add results
            resultsParent.appendChild(
                ContentHeader.getElement("Payment Results")
            );
            resultsParent.appendChild(Results.getElement(resObj));

            const scheduleParent =
                document.getElementById("schedule-container");

            // clear previous results
            while (scheduleParent.hasChildNodes()) {
                scheduleParent.removeChild(scheduleParent.lastChild);
            }

            scheduleParent.append(
                ContentHeader.getElement("Amortization Schedule")
            );

            // get table html element
            const amortSchedule = getAmortizedSchedule(loan, interest, term);
            scheduleParent.appendChild(OutputTable.getElement(amortSchedule));
            const lastPaymentItem = amortSchedule[amortSchedule.length - 1];

            //chartParent.appendChild(Visual.getChartElementContainer());
            setTimeout(() => {
                Visual.render([
                    lastPaymentItem.totalInterest,
                    lastPaymentItem.totalPrincipal,
                ]);
            }, 150);
            console.log(amortSchedule);
        }
    },
    getInput: (
        labelText,
        inputName,
        inputType = "text",
        isRequired = false
    ) => {
        const container = document.createElement("div");
        container.classList.add("form-input");

        const label = document.createElement("label");
        label.textContent = labelText;

        const input = document.createElement("input");
        input.type = inputType;
        input.name = inputName;
        input.id = inputName;

        input.onkeyup = debounce((e) => {
            if (inputName == "loanAmount") {
                amountSet = input.value ? true : false;
            } else if (inputName == "interestRate") {
                rateSet = input.value ? true : false;
            } else if (inputName == "loanTerm") {
                termSet = input.value ? true : false;
            }
            if (amountSet && rateSet && termSet) {
                InputForm.submitHandler(e);
            }
        }, 550);

        if (isRequired) {
            input.required = true;
        }

        // input.style.marginBottom = "1rem";

        container.appendChild(label);
        container.appendChild(input);
        return container;
    },
    getElement: () => {
        // Create a form element
        const { getInput } = InputForm;
        const form = document.createElement("form");
        form.classList.add("loan-form");
        const amountInput = getInput(
            "Loan Amount:",
            "loanAmount",
            "number",
            true
        );
        const rateInput = getInput(
            "Interest Rate (%):",
            "interestRate",
            "number",
            true
        );
        const termsInput = getInput(
            "Loan Term (years):",
            "loanTerm",
            "number",
            true
        );
        amountInput.focus = true;
        form.appendChild(amountInput);
        form.appendChild(rateInput);
        form.appendChild(termsInput);
        /* form.appendChild(
            getInput("Extra Payments:", "extraPayments", "number")
        ); */

        // Create a submit button
        const submitButton = document.createElement("input");
        submitButton.classList.add("btn", "teal", "lighten-3");
        submitButton.type = "submit";
        submitButton.value = "Calculate";
        submitButton.onclick = (e) => InputForm.submitHandler(e);
        form.appendChild(submitButton);
        return {
            element: form,
            callback: (e) => {
                setTimeout(() => {
                    loanAmount.focus();
                }, 100);
            },
        };
    },
    render: (parent_id = DEFAULT_RENDER_CONTAINER_ID) => {
        const parent = document.getElementById(parent_id);
        if (parent) {
            const { element, callback } = InputForm.getElement(parent);
            parent.appendChild(element);
            if (callback) callback();
        }
    },
};
