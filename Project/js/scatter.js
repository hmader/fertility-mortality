

function drawScatter(data) {
    
    var dotRadius = 5;

var xScale = d3.scale.linear()
    .range([margin.left, width - margin.left - margin.right]); //--- range is what we are mapping TO, so we want it to be the chart area


var yScale = d3.scale.linear()
    .range([height - margin.bottom, margin.top]); //--- range is what we are mapping TO, so we want it to be the chart area


var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(15);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var svg = d3.select('#vis2').append('svg')
        .attr('width', width)
        .attr('height', height);



    xScale.domain([0, d3.max(data, function (d) {
        return +d.IMR;
    })]);

    yScale.domain([0, d3.max(data, function (d) {
        return +d.FertilityRate;
    })]);

    var circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle");

    circles.attr("class", "dots");
    // class to the circles - ".dots".

    circles.attr("cx", function (d) {
        if(d.IMR) {
            return xScale(+d.IMR);
        }
        })
        .attr("cy", function (d) {
        if(d.IMR) {
            return yScale(+d.FertilityRate);
        }
        })
        .attr("r", dotRadius) // you might want to increase your dotRadius
        .attr("fill", function(d) {
        if (d.IMR) {
        return color;
        } else {
         return "#fff";   
        }
    })
    .attr("opacity", ".6")
        .append("title")
        .text(function (d) {
            return d.Country + " Fertility rate: " + d3.format(".2f")(d.FertilityRate) + ", Under-5 Mortality Rate: " + d.IMR;
        });

    // fix these translates so they use your margin and height width as needed
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxis)
    .append("text")
    .attr("x", width - margin.right - margin.left)
    .attr("y", -20)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .attr("class", "label")
    .text("Infant Mortality Rate");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (margin.left) + ",0)")
        .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -50)
    .attr("y", 5)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .attr("class", "label")
    .text("Fertility Rate");

}