
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


const submitReply = async (e) => {
    e.preventDefault();
    console.log("Replying to a post...");
    // TODO Less ugly way of doing this?
    const replyParent = e.target.parentElement.parentElement.id;
    const posttext = e.target.parentElement.children.item(0).firstElementChild.value;


    if (replyParent && posttext) {
        fetch("http://localhost:3000/connect/reply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                parent: replyParent,
                thread: posttext,
            }),
        })
        .catch((err) => console.error(err));
    }

}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("post-submit").onclick = (e) => {
        submitPost(e);
    };


    var list = document.getElementsByClassName("POST_REPLY");
    for (let item of list) {
        item.children.namedItem("reply-submit").onclick = (e) => {
            submitReply(e);
        };
    };
    document.getElementById("post-text").focus();
});
