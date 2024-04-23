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

const formatNumber = (n) => {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+\b)/g, ",");
};

const parseCurrency = (input) => {
    const num = input.replace(/[^0-9.]/g, "");
    return parseFloat(num);
};

const formatCurrency = (input, blur) => {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.

    // get input value
    var input_val = input.value;

    // don't validate empty input
    if (input_val === "") {
        return;
    }

    // original length
    var original_len = input_val.length;

    // initial caret position
    var caret_pos = input.selectionStart;

    // check for decimal
    if (input_val.indexOf(".") >= 0) {
        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf(".");

        // split number by decimal point
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);

        // add commas to left side of number
        left_side = formatNumber(left_side);

        // validate right side
        right_side = formatNumber(right_side);

        // On blur make sure 2 numbers after decimal
        if (blur === "blur") {
            right_side += "00";
        }

        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);

        // join number by .
        input_val = "$" + left_side + "." + right_side;
    } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        input_val = formatNumber(input_val);
        input_val = "$" + input_val;

        // final formatting
        if (blur === "blur") {
            input_val += ".00";
        }
    }

    // send updated string to input
    input.value = input_val;

    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
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
        const loan = Number(
            parseCurrency(document.getElementById("loanAmount").value)
        );
        const interest = Number(document.getElementById("interestRate").value);
        const term = Number(document.getElementById("loanTerm").value);
        const monthly = Number(
            document.getElementById("extraMonthlyPayment").value
        );

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
            var interestSaving = 0.0;
            var timeSaving = 0.0;

            if (monthly) {
                extraSaving = getSavingsExtraMonthly(
                    loan,
                    interest,
                    term,
                    monthly
                )[0];
                interestSaving = extraSaving.interest;
                timeSaving = extraSaving.years;
                totalInterest = totalInterest - interestSaving;
            }

            console.log(
                `Finished ${timeSaving} years or ${
                    timeSaving * 12
                } months earlier`
            );

            const totalAmountPaid = getTotalAmountPaid(loan, totalInterest);

            const resObj = {
                "Monthly Payment": fixedMonthlyPayment,
                "Total Interest": totalInterest,
                "Total Amount Paid": totalAmountPaid,
                "Interest Saving": interestSaving,
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
        input.type = "text";
        input.name = inputName;
        input.id = inputName;
        input.pattern = "^$d{1,3}(,d{3})*(.d+)?$";
        input.setAttribute("data-type", "currency");
        input.onkeyup = debounce((e) => {
            if (inputName == "loanAmount") {
                amountSet = input.value ? true : false;
                formatCurrency(input);
            } else if (inputName == "interestRate") {
                rateSet = input.value ? true : false;
            } else if (inputName == "loanTerm") {
                // cap at 50 years
                if (input.value > 50) input.value = 50;
                termSet = input.value ? true : false;
            }
            if (amountSet && rateSet && termSet) {
                InputForm.submitHandler(e);
            }
        }, 550);

        //input.onblur = () => formatCurrency(input.value, "blur");

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
