import { DEFAULT_RENDER_CONTAINER_ID } from "../constants.js";
import {
    getMonthlyPayments,
    getTotalInterest,
    getTotalAmountPaid,
    getAmortizedSchedule,
    getSavingsExtraMonthly,
} from "../calculations.js";
import { debounce } from "../utils.js";
import { Results } from "./Results.js";
import { ContentHeader } from "./ContentHeader.js";
import { OutputTable } from "./OutputTable.js";
import { Visual } from "./Visual.js";

let amountSet = false;
let rateSet = false;
let termSet = false;
let monthlySet = false;
let chart = {};
const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
};

export const InputForm = {
    loadEventListeners: () => {},
    downloadExcel: (e, res, schedule) => {
        // data headers
        const data = [
            [
                "Year",
                "Month",
                "Interest",
                "Principal",
                "Balance",
                "TotalInterest",
                "TotalPrincipal",
            ],
        ];
        // add all the data
        schedule.forEach((item) => {
            data.push([
                item.year,
                item.month,
                item.interest,
                item.principal,
                item.balance,
                item.totalInterest,
                item.totalPrincipal,
            ]);
        });

        // Create a worksheet
        const ws = XLSX.utils.aoa_to_sheet(data);

        /*      // Create a line chart object
        const chart = {
            type: "line",
            series: [{ values: { Sheet1: `B2:B${data.length}` } }],
            categories: [{ values: { Sheet1: "A2:A6" } }],
        };

        // Add the chart to the worksheet
        XLSX.utils.book_append_chart(ws, chart); */

        // Create a workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Generate a binary string from the workbook
        const excelBinaryString = XLSX.write(wb, {
            bookType: "xlsx",
            type: "binary",
        });

        // Create a Blob from the binary string
        const blob = new Blob([s2ab(excelBinaryString)], {
            type: "application/octet-stream",
        });

        // Create an anchor element for the download
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `amortization_schedule_${new Date()
            .toJSON()
            .slice(0, 10)}_.xlsx`;

        // Simulate a click to trigger the download
        a.click();
    },
    submitHandler: (e) => {
        e.preventDefault();

        // toggle margin on terms container for better visual flow
        const termsContainer = document.getElementById("terms-container");
        if (termsContainer.classList.contains("m-auto")) {
            termsContainer.classList.remove("m-auto");
            termsContainer.classList.add("m-15");
        }
        const loan = Number(document.getElementById("loanAmount").value);
        const interest = Number(document.getElementById("interestRate").value);
        const term = Number(document.getElementById("loanTerm").value);
        const monthly = Number(document.getElementById("extraMonthlyPayment").value);

        // cap term at 50 years regardless of what they put
        const cap = term <= 50 ? term : 50;
        document.getElementById("loanTerm").value = cap;
        console.log(`Extra payment: ${monthly}`);

        //const extra = document.getElementById("extraPayments").value;
        if (loan && interest && term) {

            const fixedMonthlyPayment = getMonthlyPayments(
                loan,
                interest,
                term
            );
            var totalInterest = getTotalInterest(
                fixedMonthlyPayment,
                loan,
                interest,
                term
            );

            var extraSaving = [];
            var interestSaving = 0.00;
            var timeSaving = 0.00;

            if (monthly) {
                extraSaving = getSavingsExtraMonthly(loan, interest, term, monthly)[0];
                interestSaving = extraSaving.interest
                timeSaving = extraSaving.years;
                totalInterest = totalInterest - interestSaving;
            }
            
            console.log(`Finished ${timeSaving} years or ${timeSaving*12} months earlier`);

            const totalAmountPaid = getTotalAmountPaid(loan, totalInterest);

            const resObj = {
                "Monthly Payment": fixedMonthlyPayment,
                "Total Interest": totalInterest,
                "Total Amount Paid": totalAmountPaid,
                "Interest Saving": interestSaving
            };
            console.log(resObj, "resObject");

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

            const downloadExcelButton = document.createElement("a");
            downloadExcelButton.href = "#";
            downloadExcelButton.id = "download-excel";
            downloadExcelButton.classList.add(
                "btn",
                "teal",
                "lighten-3",
                "color-white",
                "ml-auto"
            );
            downloadExcelButton.textContent = "Download Excel";

            const img = document.createElement("i");
            img.classList.add("fa-sharp", "fa-solid", "fa-download", "left");

            //const span = document.createElement("span");
            // span.textContent = "Download Excel";

            downloadExcelButton.prepend(img);
            //downloadExcelButton.appendChild(span);

            scheduleParent.append(
                ContentHeader.getElement(
                    "Amortization Schedule",
                    downloadExcelButton
                )
            );
            var amortSchedule = [];

                amortSchedule = getAmortizedSchedule(monthly, loan, interest, term);

  
            scheduleParent.appendChild(OutputTable.getElement(amortSchedule));
            const lastPaymentItem = amortSchedule[amortSchedule.length - 1];

            localStorage.setItem("results", JSON.stringify(resObj));
            localStorage.setItem("schedule", JSON.stringify(amortSchedule));

            const downloadExcel = document.getElementById("download-excel");
            downloadExcel.onclick = (e) => {
                e.preventDefault();
                InputForm.downloadExcel(e, resObj, amortSchedule);
            };
            downloadExcel.classList.remove("d-none");
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
                // cap at 50 years
                if (input.value > 50) input.value = 50;
                termSet = input.value ? true : false;
            }
             else if (inputName == "extraMonthlyPayment") {
                monthlySet = input.value ? true : false;
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
        const monthlyInput = getInput(
            "Extra Montly Payment ($):",
            "extraMonthlyPayment",
            "number",
            true
        );
        amountInput.focus = true;
        form.appendChild(amountInput);
        form.appendChild(rateInput);
        form.appendChild(termsInput);
        form.appendChild(monthlyInput);

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
