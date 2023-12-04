import { ComingSoon } from "./ComingSoon.js";
import { MainContent } from "./MainContent.js";
import {
    DEFAULT_RENDER_CONTAINER_ID,
    DEFAULT_COMING_SOON,
} from "../constants.js";

export const UI = {
    render: (parent_id = DEFAULT_RENDER_CONTAINER_ID) => {
        const parent = document.getElementById(parent_id);
        if (parent) {
            // if we're showing coming soon, then render that component and return
            if (DEFAULT_COMING_SOON) {
                return ComingSoon.render();
            } else {
                return MainContent.render();
                //parent.append(OutputTable.getElement());
            }
        }
    },
};
