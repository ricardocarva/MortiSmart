import { USDollar, removeAllByClass } from "../utils.js";

export const OutputTable = {
    // creates and returns dom element
    getElement: (data = [1, 2, 3]) => {
        // create table element container and table
        const overflowWrapper = document.createElement("div");
        overflowWrapper.classList.add("overflow-table");

        const table = document.createElement("table");

        // make sure we have an array and that it has some items
        if (Array.isArray(data) && data.length) {
            // create table header row and headers
            const headerRow = document.createElement("tr");
            const year = document.createElement("th");
            const month = document.createElement("th");
            const interest = document.createElement("th");
            const principal = document.createElement("th");
            const balance = document.createElement("th");
            const totalInterest = document.createElement("th");
            const totalPrincipal = document.createElement("th");

            // update the text of the headers
            year.textContent = "Year";
            month.textContent = "Month";
            interest.textContent = "Interest";
            principal.textContent = "Principal";
            balance.textContent = "Balance";
            totalInterest.textContent = "Total Interest";
            totalPrincipal.textContent = "Total Principal";

            // add headers to the header row and then the header tow to the table
            headerRow.append(
                year,
                month,
                interest,
                principal,
                balance,
                totalInterest,
                totalPrincipal
            );
            table.appendChild(headerRow);

            const dollar = USDollar();
            let labeledThreshold = false;
            // for every item in our data set, build a new table tow
            data.forEach((item) => {
                // create new row
                const tr = document.createElement("tr");
                if (
                    !labeledThreshold &&
                    item.totalInterest < item.totalPrincipal
                ) {
                    tr.classList.add("bd-bottom-green");
                    labeledThreshold = true;
                }
                // create columns
                const year = document.createElement("td");
                year.textContent = item.year;

                const month = document.createElement("td");
                month.textContent = item.month;

                const interest = document.createElement("td");
                interest.textContent = dollar.format(item.interest);

                const principal = document.createElement("td");
                principal.textContent = dollar.format(item.principal);

                const balance = document.createElement("td");
                balance.textContent = dollar.format(item.balance);

                const totalInterest = document.createElement("td");
                totalInterest.classList.add("grey-border-left", "grey-bg");
                totalInterest.textContent = dollar.format(item.totalInterest);

                const totalPrincipal = document.createElement("td");
                totalPrincipal.classList.add("grey-border-right", "grey-bg");
                totalPrincipal.textContent = dollar.format(item.totalPrincipal);

                // add colmns to row and row to table
                tr.append(
                    year,
                    month,
                    interest,
                    principal,
                    balance,
                    totalInterest,
                    totalPrincipal
                );
                table.appendChild(tr);
                overflowWrapper.appendChild(table);
            });

            removeAllByClass("d-none");
        }
        return overflowWrapper;
    },

    // renders element to given parent element
    render: (parent_id) => {
        if (parent_id) {
            const parent = document.getElementById(parent_id);
            if (parent) {
                parent.append(OutputTable.getElement());
            }
        }
    },
};
