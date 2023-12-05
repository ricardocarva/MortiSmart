const submitPost = async (e) => {
    e.preventDefault();
    console.log("Creating a post...");
    const posttext = document.getElementById("post-text").value;
    const title = document.getElementById("post-title").value;
    console.log("Post text is: ", posttext, title);
    if (posttext && title) {
        fetch("http://localhost:3000/connect/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                thread: posttext,
            }),
        })
            .then((res) => {
                fetch("http://localhost:3000/connect/get-posts").then((res) => {
                    console.log(res, "this is what we want");
                });
            })
            .catch((err) => console.error(err));
    }
};

const submitReply = async (e) => {
    e.preventDefault();
    console.log("Replying to a post...");
    // TODO Less ugly way of doing this?
    const replyParent = e.target.getAttribute("threadid") || "";
    const posttext =
        e.target.parentElement.children.item(0).firstElementChild.value;
    console.log(replyParent, posttext);
    if (replyParent && posttext) {
        console.log("reply valid");
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
            .then((res) => console.log(res.json()))
            .catch((err) => console.error(err));
        buildPostHTML();
    }
};

const buildPostHTML = () => {
    let postStr = "";
    fetch("http://localhost:3000/connect/get-posts")
        .then((res) => {
            return res.json();
        })
        .then((posts) => {
            if (Array.isArray(posts.arrForum)) {
                posts.arrForum.forEach((post) => {
                    postStr += `<div class="card p-1">
                <div class="row m-0 card-title align">
                    <span class="left">${post.title}</span>
                    <small class="right">${post.creator}</small>
                </div>
                <p>${post.content}</p>`;
                    if (post.replies.length) {
                        postStr += `<ul>`;
                        post.replies.forEach((reply) => {
                            postStr += `<li>
                            <div class="row m-0">${reply.creator}</div>
                            <div class="row m-0">${reply.content}</div>
                        </li>`;
                        });
                    }
                    postStr += `
            <div class="POST_REPLY">
            <div class="input-field col s12">
              <textarea id="reply-text" class="materialize-textarea"></textarea>
              <label style="width:100%;" for="reply-text">Write your reply here</label>
            </div>
            <button
              id="reply-submit"
              class="REPLYBUTTON btn btn-login teal lighten-3 m-auto"
              threadid="${post._id}"
            >
              <i class="fa-solid fa-question left"></i>
              Submit a reply
            </button>
          </div></div>`;

                    document.getElementById("forum-container").innerHTML =
                        postStr;
                });
                var list = document.getElementsByClassName("POST_REPLY");
                for (let item of list) {
                    item.children.namedItem("reply-submit").onclick = (e) => {
                        submitReply(e);
                    };
                }
            }
        });
};

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("hideNew");
    container.classList.add("d-none");
    const icon = document.getElementById("newPostIcon");

    document.getElementById("newPost").onclick = (e) => {
        if (container.classList.contains("d-none")) {
            container.classList.remove("d-none");
            icon.classList.remove("fa-plus");
            icon.classList.add("fa-close");

            document.getElementById("post-submit").onclick = (e) => {
                submitPost(e);
                buildPostHTML();
            };
        } else {
            container.classList.add("d-none");
            icon.classList.remove("fa-close");
            icon.classList.add("fa-plus");
        }
    };

    document.getElementById("post-title").focus();
    buildPostHTML();
});
