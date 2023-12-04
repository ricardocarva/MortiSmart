// coming soon component used in development
import { USDollar, getMode } from "../utils.js";
export const Results = {
    getElement: (dataObj) => {
        // create div element
        const div = document.createElement("div");

        // add class to
        div.classList.add("results", getMode());

        const dollar = USDollar();
        for (const [key, val] of Object.entries(dataObj)) {
            const innerDiv = document.createElement("div");
            innerDiv.classList.add("results-item");

            const spanLeft = document.createElement("span");
            spanLeft.classList.add("result-span", "left");
            spanLeft.textContent = key;

            const spanRight = document.createElement("span");
            spanRight.classList.add("result-span", "right", "bold");
            spanRight.textContent = dollar.format(val);

            innerDiv.append(spanLeft, spanRight);
            div.appendChild(innerDiv);
        }

        return div;
    },
    render: (parent_id) => {
        if (parent_id) {
            const parent = document.getElementById("results-container");
            if (parent) {
                parent.append(Results.getElement());
            }
        }
    },
};
