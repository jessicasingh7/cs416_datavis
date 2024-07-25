const scenes = ["scene1", "scene2", "scene3", "exploration"];
let currentScene = 0;

async function loadData() {
    const data = await d3.csv("cars2017.csv");
    createScene1(data);
    createScene2(data);
    createScene3(data);
    createExploration(data);
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
        .domain(d3.extent(data, d => +d.enginecylinders))
        .range([50, 750]);
    
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.averagehighwaympg))
        .range([350, 50]);

    const line = d3.line()
        .x(d => x(d.enginecylinders))
        .y(d => y(d.averagehighwaympg));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

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
        .domain(data.map(d => d.fuel))
        .range([50, 750])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.averagecitympg)])
        .range([350, 50]);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.fuel))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.averagecitympg))
        .attr("height", d => 350 - y(d.averagecitympg))
        .attr("fill", "green");

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
        .domain(d3.extent(data, d => +d.averagecitympg))
        .range([50, 750]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.averagehighwaympg))
        .range([350, 50]);

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.averagecitympg))
        .attr("cy", d => y(d.averagehighwaympg))
        .attr("r", 5)
        .attr("fill", "red");

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

function createExploration(data) {
    const svg = d3.select("#exploration").append("svg")
        .attr("width", 800)
        .attr("height", 400);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.enginecylinders))
        .range([50, 750]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.averagehighwaympg))
        .range([350, 50]);

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.enginecylinders))
        .attr("cy", d => y(d.averagehighwaympg))
        .attr("r", 5)
        .attr("fill", "blue")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("r", 10)
                .attr("fill", "orange");

            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", x(d.enginecylinders))
                .attr("y", y(d.averagehighwaympg) - 10)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text(`${d.make} - ${d.fuel}`);
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
        .text("Interactive Exploration: Engine Cylinders vs. Average Highway MPG");
}