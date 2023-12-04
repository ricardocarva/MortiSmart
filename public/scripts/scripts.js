import { UI } from "./components/UI.js";
import { TopBar } from "./components/TopBar.js";
import { Footer } from "./components/Footer.js";

const topBar = TopBar;
const ui = UI;
const footer = Footer;
const components = {
    topBar,
    ui,
    footer,
};

// main jumping off point of application
((components) => {
    // destructure from components
    const { topBar, footer, ui } = components;

    // render main components
    topBar.render();
    footer.render();
    const callbacks = ui.render();
    if (callbacks)
        callbacks.forEach((callback) => {
            if (typeof callback === "function") callback();
        });
})(components);
