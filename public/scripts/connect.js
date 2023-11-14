
const submitPost = async (e) => {
    e.preventDefault();
    console.log("Creating a post...");
    const posttext = document.getElementById("post-text").value;
    console.log("Post text is: ", posttext);
    if (posttext) {
        fetch("http://localhost:3000/connect/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                thread: posttext,
            }),
        })
        .catch((err) => console.error(err));
    }
};

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("post-submit").onclick = (e) => {
        submitPost(e);
    };
    document.getElementById("post-text").focus();
});
