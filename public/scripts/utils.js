// define format for us dollar currency so it shows with dollar sign and commas
export const USDollar = (data) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

// generic debounce function used to help give user time to type a full word before checking their input
export const debounce = (func, timeout = 350) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, timeout);
    };
};

export const getMode = (e) => {
    return document.body.classList.contains("light") ? "light" : "dark";
};

export const removeAllByClass = (className) => {
    const items = document.querySelectorAll(`.${className}`);
    for (const item of items) {
        item.classList.remove(className);
    }
};

export const enableDarkMode = (e) => {
    // get the components
    const body = document.querySelector("body");
    const headers = document.querySelectorAll(".content-header");
    const containers = document.querySelectorAll(".container");
    const results = document.querySelectorAll(".results");
    const topBar = document.getElementById("top-bar");

    //body
    if (body && body.classList.contains("light")) {
        body.style.backgroundColor = "var(--dark-bg)";
        body.classList.remove("light");
        body.classList.add("dark");
    }

    // top bar
    if (topBar && topBar.classList.contains("light")) {
        topBar.classList.remove("light", "light-header-bg", "light-header-txt");
        topBar.classList.add("dark", "dark-header-bg", "dark-header-txt");
    }

    // content headers
    if (headers && headers.length && headers[0].classList.contains("light"))
        headers.forEach((header) => {
            if (header.classList.contains("light")) {
                header.classList.remove(
                    "light",
                    "light-header-bg",
                    "light-header-txt"
                );
                header.classList.add(
                    "dark",
                    "dark-header-bg",
                    "dark-header-txt"
                );
            }
        });

    // containers
    if (
        containers &&
        containers.length &&
        containers[0].classList.contains("light")
    )
        containers.forEach((container) => {
            if (container.classList.contains("light")) {
                container.classList.remove(
                    "light",
                    "light-container-bg",
                    "light-container-txt",
                    "light-container-border"
                );
                container.classList.add(
                    "dark",
                    "dark-container-bg",
                    "dark-container-txt",
                    "dark-container-border"
                );
            }
        });

    // results
    if (results && results.length && results[0]) {
        results.forEach((result) => {
            if (result.classList.contains("light")) {
                result.classList.remove(
                    "light",
                    "light-results-bg",
                    "light-results-txt",
                    "light-results-border"
                );
                result.classList.add(
                    "dark",
                    "dark-results-bg",
                    "dark-results-txt",
                    "dark-results-border"
                );
            }
        });
    }
};

export const enableLightMode = (e) => {
    // get the components
    const body = document.querySelector("body");
    const headers = document.querySelectorAll(".content-header");
    const containers = document.querySelectorAll(".container");
    const results = document.querySelectorAll(".results");
    const topBar = document.getElementById("top-bar");

    // body
    if (body && body.classList.contains("dark")) {
        body.style.backgroundColor = "var(--light-grey-bg)";
        body.classList.remove("dark");
        body.classList.add("light");
    }

    // top bar
    if (topBar && topBar.classList.contains("dark")) {
        topBar.classList.remove("dark", "dark-header-bg", "dark-header-txt");
        topBar.classList.add("light", "light-header-bg", "light-header-txt");
    }

    // content headers
    if (headers && headers[0].classList.contains("dark"))
        headers.forEach((header) => {
            if (header.classList.contains("dark")) {
                header.classList.remove("dark");
                header.classList.remove(
                    "dark",
                    "dark-header-bg",
                    "dark-header-txt"
                );
                header.classList.add(
                    "light",
                    "light-header-bg",
                    "light-header-txt"
                );
            }
        });

    // content headers
    if (containers && containers[0].classList.contains("dark"))
        containers.forEach((container) => {
            if (container.classList.contains("dark")) {
                container.classList.remove(
                    "dark",
                    "dark-container-bg",
                    "dark-container-txt",
                    "dark-container-border"
                );
                container.classList.add(
                    "light",
                    "light-container-bg",
                    "light-container-txt",
                    "light-container-border"
                );
            }
        });

    // results
    if (results && results.length && results[0]) {
        results.forEach((result) => {
            if (result.classList.contains("dark")) {
                result.classList.remove(
                    "dark",
                    "dark-results-bg",
                    "dark-results-txt",
                    "dark-results-border"
                );
                result.classList.add(
                    "light",
                    "light-results-bg",
                    "light-results-txt",
                    "light-results-border"
                );
            }
        });
    }
};
