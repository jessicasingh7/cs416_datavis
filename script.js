const scenes = ["scene1", "scene2", "scene3"];
let currentScene = 0;

async function loadData() {
    const data = await d3.csv("cars2017.csv");
    enginevsmpg(data);
    fuelvsmpg(data);
    cityvshighway(data);
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

function enginevsmpg(data) {
    const svg = d3.select("#scene1").append("svg")
        .attr("width", 800)
        .attr("height", 400);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.EngineCylinders))
        .range([50, 750]);
    
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.AverageHighwayMPG))
        .range([350, 50]);

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.EngineCylinders))
        .attr("cy", d => y(d.AverageHighwayMPG))
        .attr("r", 5)
        .attr("fill", "green")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("r", 10)
                .attr("fill", "red");

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
        .attr("transform", "translate(400, 390)")
        .style("text-anchor", "middle")
        .text("Engine Cylinders");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("x", -200)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average Highway MPG");

    svg.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "17px")
        .text("Average Highway MPG vs Engine Cylinders");
}

function fuelvsmpg(data) {
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
                .attr("fill", "red");

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
        .attr("transform", "translate(400, 390)")
        .style("text-anchor", "middle")
        .text("Fuel Type");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("x", -200)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average City MPG");

    svg.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "17px")
        .text("Average City MPG by Type of Fuel");
}

function cityvshighway(data) {
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
        .attr("fill", "pink")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("r", 10)
                .attr("fill", "red");

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
                .attr("fill", "pink");

            svg.select("#tooltip").remove();
        });

    svg.append("g")
        .attr("transform", "translate(0, 350)")
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "translate(400, 390)")
        .style("text-anchor", "middle")
        .text("Average City MPG");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("x", -200)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average Highway MPG");

    svg.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "17px")
        .text("Average Highway vs Average City MPG");
}