(async () => {
    // fetch news articles
    const container = document.getElementById("news-container");
    container.style.display = "block";

    const res = await axios.get("/get-articles", {});
    container.style.display = "flex";
    container.innerHTML = res.data.articles;
})();
