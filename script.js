const scenes = ["scene1", "scene2", "scene3"];
let currentScene = 0;

async function loadData() {
    const data = await d3.csv("cars2017.csv");
    createScene1(data);
    createScene2(data);
    createScene3(data);
}

loadData();

function showScene(index) {
    scenes.forEach((scene, i) => {
        d3.select(`#${scene}`).classed("visible", i === index);
    });
}

document.getElementById("next").addEventListener("click", () => {
    currentScene = (currentScene + 1) % scenes.length;
    showScene(currentScene);
});

function createScene1(data) {
    const svg = d3.select("#scene1").append("svg")
        .attr("width", 800)
        .attr("height", 400);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.EngineCylinders))
        .range([50, 750]);
    
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.AverageHighwayMPG))
        .range([350, 50]);

    const line = d3.line()
        .x(d => x(d.EngineCylinders))
        .y(d => y(d.AverageHighwayMPG));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.EngineCylinders))
        .attr("cy", d => y(d.AverageHighwayMPG))
        .attr("r", 5)
        .attr("fill", "blue")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("r", 10)
                .attr("fill", "orange");

            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", x(d.EngineCylinders))
                .attr("y", y(d.AverageHighwayMPG) - 10)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text(`Cylinders: ${d.EngineCylinders}, AverageMPG: ${d.AverageHighwayMPG}`);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr("r", 5)
                .attr("fill", "blue");

            svg.select("#tooltip").remove();
        });

    svg.append("g")
        .attr("transform", "translate(0, 350)")
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Average Highway MPG vs Engine Cylinders");
}

function createScene2(data) {
    const svg = d3.select("#scene2").append("svg")
        .attr("width", 800)
        .attr("height", 400);

    const x = d3.scaleBand()
        .domain(data.map(d => d.Fuel))
        .range([50, 750])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.AverageCityMPG)])
        .range([350, 50]);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Fuel))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.AverageCityMPG))
        .attr("height", d => 350 - y(d.AverageCityMPG))
        .attr("fill", "green")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("fill", "orange");

            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", x(d.Fuel) + x.bandwidth() / 2)
                .attr("y", y(d.AverageCityMPG) - 10)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text(`Fuel: ${d.Fuel}, City MPG: ${d.AverageCityMPG}`);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr("fill", "green");

            svg.select("#tooltip").remove();
        });

    svg.append("g")
        .attr("transform", "translate(0, 350)")
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Average City MPG by Fuel Type");
}

function createScene3(data) {
    const svg = d3.select("#scene3").append("svg")
        .attr("width", 800)
        .attr("height", 400);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.AverageCityMPG))
        .range([50, 750]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.AverageHighwayMPG))
        .range([350, 50]);

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.AverageCityMPG))
        .attr("cy", d => y(d.AverageHighwayMPG))
        .attr("r", 5)
        .attr("fill", "blue")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("r", 10)
                .attr("fill", "orange");

            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", x(d.AverageCityMPG))
                .attr("y", y(d.AverageHighwayMPG) - 10)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text(`${d.Make} - ${d.Fuel}`);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr("r", 5)
                .attr("fill", "blue");

            svg.select("#tooltip").remove();
        });

    svg.append("g")
        .attr("transform", "translate(0, 350)")
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Average Highway MPG vs Average City MPG");
}