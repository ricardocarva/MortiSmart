// coming soon component used in development
import { DEFAULT_TOP_BAR_RENDER_CONTAINER_ID } from "../constants.js";
import { enableDarkMode, enableLightMode } from "../utils.js";

let lightMode = true;
export const TopBar = {
    toggleMode: (e) => {
        setTimeout((e) => {
            // toggle the mode
            lightMode = !lightMode;

            // light mode
            if (lightMode) {
                enableLightMode();
            }
            // dark mode
            else {
                enableDarkMode();
            }
        }, 100);
    },
    getElement: () => {
        // create div
        const div = document.createElement("div");
        div.classList.add("top-bar");

        // create header
        const h1 = document.createElement("h1");
        h1.textContent = "MortiSmart";

        // create light/dark mode toggle
        const toggleDiv = document.createElement("div");
        toggleDiv.id = "toggle-container";

        const toggle = document.createElement("i");
        toggle.id = "toggle";
        toggle.classList.add("light-mode", "toggle", "fa-regular", "fa-sun");
        toggleDiv.onclick = (e) => {
            //e.preventDefault();
            //e.stopPropagation();
            TopBar.toggleMode(e);
        };

        const toggleSwitch = document.createElement("label");
        toggleSwitch.classList.add("switch");
        toggleSwitch.innerHTML = ` <input id="toggle-input" type="checkbox"><span class="slider round"></span>`;
        toggleSwitch.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const input = document.getElementById("toggle-input");
            input.checked = input.checked ? false : true;
            TopBar.toggleMode(e);
        });

        //toggleDiv.appendChild(toggle);
        toggleDiv.appendChild(toggleSwitch);

        div.appendChild(h1);
        div.appendChild(toggleDiv);

        return div;
    },
    render: (parent_id = DEFAULT_TOP_BAR_RENDER_CONTAINER_ID) => {
        const parent = document.getElementById(parent_id);
        if (parent) {
            parent.append(TopBar.getElement());
        }
    },
};
