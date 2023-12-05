// import necessary components and files
import { DEFAULT_RENDER_CONTAINER_ID } from "../constants.js";
import { InputForm } from "./InputForm.js";
import { ContentHeader } from "./ContentHeader.js";

export const MainContent = {
    currentPage: 1,
    totalPages: 2,

    render: (parent_id = DEFAULT_RENDER_CONTAINER_ID) => {
        const callbacks = [];
        const { currentPage, totalPages } = MainContent;
        const parent = document.getElementById(parent_id);
        if (parent) {
            parent.append(ContentHeader.getElement("Loan Terms"));
            const { element, callback } = InputForm.getElement(parent);
            if (callback) callbacks.push(callback);
            parent.appendChild(element);
            return callbacks;
        }
    },
};
