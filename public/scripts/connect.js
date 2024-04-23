const submitPost = async (e) => {
    e.preventDefault();
    document.getElementById("newpost-progress-row").classList.remove("d-none");

    console.log("Creating a post...");
    const posttext = document.getElementById("post-text").value;
    const title = document.getElementById("post-title").value;

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
                // hide the progress bar before fetching posts
                document
                    .getElementById("newpost-progress-row")
                    .classList.add("d-none");
                fetch("http://localhost:3000/connect/get-posts").then(
                    (res) => {}
                );
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
            .then((res) => {
                axios
                    .get(
                        `http://localhost:3000/connect/get-replies?postId=${replyParent}`
                    )
                    .then((response) => {
                        console.log("Response:", response.data);
                        //console.log(res.json()))
                        setTimeout(() => {
                            const parent = response.data.replies[0].parent;
                            const replySection = document.getElementById(
                                `reply_list_${parent}`
                            );
                            let html = "";
                            response.data.replies.forEach((reply) => {
                                html += buildReplyHtml(reply);
                            });

                            html += ` <div class="POST_REPLY center">
                        <div class="input-field col s12 mb-0 p-1">
                          <textarea id="reply-text" class="materialize-textarea"></textarea>
                          <label style="width:100%;" for="reply-text">Write your reply here</label>
                        </div>
                        <button
                          id="reply-submit"
                          class="REPLYBUTTON btn btn-login teal lighten-3 m-auto mb-15"
                          threadid="${parent}"
                        >
                          <i class="fa-solid fa-question left"></i>
                          Submit a reply
                        </button>
                      </div></div></div>`;
                            replySection.innerHTML = html;
                        }, 200);
                    })
                    .catch((error) => {
                        // Handle errors
                        console.log("Error:", error);
                    });
            })

            .catch((err) => console.error(err));
        //buildReplyHtml();
    }
};

// builds reply html blocks
const buildReplyHtml = (reply) => {
    return `<li class="reply-item row m-0 flex wrap align">
        <p class="p-1 m-0">${reply.content}</p>
        <small class="right mr-15">${reply.creator}</small>
    </li>`;
};

const buildPostHTML = () => {
    document.getElementById("post-progress-row").classList.remove("d-none");
    let postStr = "";
    fetch("http://localhost:3000/connect/get-posts")
        .then((res) => {
            return res.json();
        })
        .then((posts) => {
            if (Array.isArray(posts.arrForum)) {
                if (posts.arrForum.length == 0) {
                    document
                        .getElementById("post-progress-row")
                        .classList.add("d-none");
                    document.getElementById("forum-container").innerHTML =
                        "<p>No Posts To Show</p>";
                }
                posts.arrForum.forEach((post) => {
                    postStr += `<div id="post_${post._id}" class=" card">
                <div class="row m-0 card card-title flex align main-post" postid="${
                    post._id
                }">
                <div class="row w-100 m-0">
                    <span class="left bold">${post.title}</span>
                </div>
                <div class="row w-100  m-0">
                    <small class="right">${
                        post.creator
                    } @ ${post.createdAt.substring(
                        0,
                        10
                    )} - ${post.createdAt.substring(11, 19)}</small>
                </div>
                </div>
                <div id="reply_section_${
                    post._id
                }" class="reply-section d-none">
                <p class="p-1 card mb-0 main-post-content">${post.content}</p>`;
                    postStr += `<ul id="reply_list_${post._id}">`;
                    if (post.replies.length) {
                        post.replies.forEach((reply) => {
                            postStr += buildReplyHtml(reply);
                        });
                    }
                    postStr += `
            <div class="POST_REPLY center">
            <div class="input-field col s12 mb-0 p-1">
              <textarea id="reply-text" class="materialize-textarea"></textarea>
              <label style="width:100%;" for="reply-text">Write your reply here</label>
            </div>
            <button
              id="reply-submit"
              class="REPLYBUTTON btn btn-login teal lighten-3 m-auto mb-15"
              threadid="${post._id}"
            >
              <i class="fa-solid fa-question left"></i>
              Submit a reply
            </button>
          </div></div></div>`;
                    document
                        .getElementById("post-progress-row")
                        .classList.add("d-none");

                    document.getElementById("forum-container").innerHTML =
                        postStr;
                });
                const mainPosts = document.querySelectorAll(".main-post");
                mainPosts.forEach((post) => {
                    post.onclick = (e) => {
                        const id = post.getAttribute("postid");
                        const reply = document.getElementById(
                            `reply_section_${id}`
                        );
                        if (reply.classList.contains("d-none")) {
                            reply.classList.remove("d-none");
                        } else {
                            reply.classList.add("d-none");
                        }
                    };
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
            // focus on title
            document.getElementById("post-title").focus();
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

    // event listener for refreshing posts
    document.getElementById("refreshPost").onclick = (e) => {
        buildPostHTML();
    };

    // start by building posts
    buildPostHTML();
});
