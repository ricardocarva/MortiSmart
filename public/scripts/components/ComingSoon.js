// coming soon component used in development
import { DEFAULT_RENDER_CONTAINER_ID } from "../constants.js";

export const ComingSoon = {
    render: (parent_id = DEFAULT_RENDER_CONTAINER_ID) => {
        const parent = document.getElementById(parent_id);
        if (parent) {
            const body = `<h1>Welcome to MortiSmart</h1>
            <p>Our exciting project is coming soon!</p>
            <p>Stay tuned for updates and more information.</p>`;
            parent.innerHTML = body;
        }
    },
};
