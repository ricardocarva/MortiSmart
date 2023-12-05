import { USDollar } from "../utils.js";
import { ContentHeader } from "./ContentHeader.js";
export const Visual = {
    getChartElementContainer: () => {
        const canvas = document.createElement("cavnas");
        canvas.classList.add("m-auto", "h-300");
        canvas.id = "chart-container";
        return canvas;
    },
    render: (data) => {
        const container = document.getElementById("visual-container");

        // clear any previous header and render content header
        container.removeChild(container.firstChild);
        container.prepend(ContentHeader.getElement("Visualization"));
        const chartParent = document.getElementById("chart-container");
        if (chartParent) {
            if (container.lastChild) {
                container.removeChild(container.lastChild);
                container.appendChild(Visual.getChartElementContainer());
            }

            // remove any previously rendered chart in this container
            if (Chart.getChart("chart-container")) {
                Chart.getChart("chart-container").destroy();
            }

            new Chart(document.getElementById("chart-container"), {
                type: "doughnut",
                data: {
                    labels: ["Interest", "Principal"],
                    datasets: [
                        {
                            label: "My First Dataset",
                            data: data,
                            backgroundColor: [
                                "rgb(243, 196, 219)",
                                "rgb(196, 243, 220)",
                            ],
                            hoverOffset: 4,
                        },
                    ],
                },
                options: {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    console.log(context);
                                    let label = context.label || "";
                                    return `${label}: ${USDollar().format(
                                        context.parsed
                                    )}`;
                                },
                            },
                        },
                    },
                },
            });

            //container.append(Visual.getChartElementContainer());
        }
    },
};
