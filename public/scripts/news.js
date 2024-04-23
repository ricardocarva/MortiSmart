// use clipboard api to copy link to clipboard
const copyToClipboard = (text, link) => {
    const msg = document.createElement("span");
    msg.classList.add("right");
    msg.textContent = "Text copied to clipboard";
    link.appendChild(msg);
    navigator.clipboard
        .writeText(text)
        .then(() => {
            link.style.color = "#5cab84";
            setTimeout(() => {
                link.removeChild(link.lastChild);
            }, 750);
        })
        .catch((err) => {
            console.error("Unable to copy text to clipboard:", err);
        });
};

(async () => {
    // fetch news articles
    const container = document.getElementById("news-container");
    container.style.display = "block";

    const res = await axios.get("/get-articles", {});
    container.style.display = "flex";
    container.innerHTML = res.data.articles;

    // set on click for each link after they render
    const copylinks = document.querySelectorAll(".copy-clip");
    copylinks.forEach((link) => {
        link.onclick = (e) => {
            const old = link.style.color;
            copyToClipboard(link.getAttribute("url"), link);
            setTimeout(() => {
                link.style.color = old;
            }, 60);
        };
    });
})();
