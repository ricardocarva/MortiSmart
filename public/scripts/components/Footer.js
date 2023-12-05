// coming soon component used in development
import { DEFAULT_FOOTER_RENDER_CONTAINER_ID } from "../constants.js";

export const Footer = {
    getElement: () => {
        const div = document.createElement("div");
        div.classList.add("footer");
        return div;
    },
    render: (parent_id = DEFAULT_FOOTER_RENDER_CONTAINER_ID) => {
        const parent = document.getElementById(parent_id);
        if (parent) {
            parent.append(Footer.getElement());
        }
    },
};
