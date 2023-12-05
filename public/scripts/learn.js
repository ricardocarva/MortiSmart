const updateMessage = (element, messages, index) => {
    messageElement.textContent = messages[currentIndex];

    // Move to the next message or cycle back to the beginning
    currentIndex = (currentIndex + 1) % messages.length;
};

const linkifyText = (text) => {
    // Regular expression to match URLs starting with "http://", "https://", or "www"
    const urlRegex = /(https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;

    // Replace URLs with anchor tags
    const linkedText = text.replace(urlRegex, function (url) {
        return `<a class="light-blue-text text-light-blue lighten-3" href="${url}" target="_blank">${url}</a>`;
    });

    return linkedText;
};

const submitLearn = async (e) => {
    e.preventDefault();
    document.getElementById("response-container").classList.remove("d-none");
    const question = document.getElementById("chat-question").value;
    if (question) {
        try {
            /*     const messages = [
                "Still waiting on ChatGPT's response...",
                "This is taking awhile, but ChatGPT should respond soon...",
                "Sorry for the delay, we're still waiting on ChatGPT's response...",
            ];
            const chatResponse = document.getElementById("chat-response");
            chatResponse.textContent =
                "Waiting for ChatGPT response. Response times vary based on ChatGPT's API traffic.";
            let currentIndex = 0;
            const updateMessage = () => {
                if (currentIndex === 2) {
                    // If it's the third message, keep displaying it
                    chatResponse.textContent = messages[2];
                    clearInterval(intervalId);
                } else {
                    // Display the current message
                    chatResponse.textContent = messages[currentIndex];

                    // Move to the next message
                    currentIndex = (currentIndex + 1) % messages.length;
                }
            };
 */
            // const intervalId = setInterval(updateMessage, 15000);

            //chatResponse.innerHTML = "";
            let str = "";
            const chatResponse = document.getElementById("chat-response");
            chatResponse.innerHTML = "";
            document
                .getElementById("login-progress-chat")
                .classList.remove("d-none");

            let eventSource = new EventSource(
                `/learn/stream?question=${question}`,
                {
                    withCredentials: false,
                }
            );

            eventSource.onopen = (event) => {
                console.log(event);
                console.log("opened");
            };

            eventSource.onmessage = (event) => {
                console.log(event, event.data);
                if (event.data.includes("Stream has ended")) {
                    str = str.replaceAll(/data: /g, "");
                    str = str.replaceAll(/(?<!\n\n)\n\n/g);
                    str = str.replaceAll(/\n\n\n\n/g, "\n\n");
                    chatResponse.innerHTML = marked.parse(str); //marked.parse(
                    // );
                    //chatResponse.removeChild(chatResponse.firstElementChild);
                    eventSource.close();
                    document
                        .getElementById("login-progress-chat")
                        .classList.add("d-none");
                } else {
                    str += event.data;
                    console.log(str);
                    chatResponse.innerHTML += event.data;
                }
            };

            eventSource.onerror = (error) => {
                console.error("EventSource error:", error);
                console.error(
                    "EventSource readyState:",
                    eventSource.readyState
                );
            };
            // await the response from server
            /*  const res = await axios.get("/learn/stream", {
                headers: {
                    question: question,
                },
            });
            console.log(res); */

            /*   clearInterval(intervalId);
            document
                .getElementById("login-progress-chat")
                .classList.add("d-none");

            //console.log("Server response: ", res.data.response.content);

            chatResponse.innerHTML = "";
            let responseContent = res.data.response; //.content;
            let list = responseContent.split("\n");

            console.log("list", list);

            chatResponse.innerHTML = responseContent;
            document.querySelectorAll("#chat-response a").forEach((item) => {
                item.target = "_blank";
            }); */
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }
};

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("chat-submit").onclick = (e) => submitLearn(e);
    document.getElementById("chat-question").focus();
});
