// coming soon component used in development
import { DEFAULT_RENDER_CONTAINER_ID } from "../constants.js";

export const ContentHeader = {
    getElement: (headerText, element = null) => {
        const div = document.createElement("div");
        div.classList.add(
            "content-header",
            "light-mode",
            "flex",
            "align-items-center"
        );
        div.innerText = headerText;
        if (element) {
            div.append(element);
        }
        return div;
    },
    render: (parent_id = DEFAULT_RENDER_CONTAINER_ID) => {
        const parent = document.getElementById(parent_id);
        if (parent) {
            parent.append(ContentHeader.getElement());
        }
    },
};
