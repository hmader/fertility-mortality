var margin = {
    top: 50,
    right: 10,
    bottom: 50,
    left: 50
};

var height = $(window).height() * .7;
var width = $(window).width() * .75;
console.log("width = " + width);

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

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var tooltip = d3.select("body")
      	.append("div")
      	.attr("class", "tooltip");

d3.csv("contraceptive-mortality-select-countries-chart.csv", function (data) {

    xScale.domain([0, d3.max(data, function (d) {
        return +d.U5MR;
    })]);

    yScale.domain([0, d3.max(data, function (d) {
        return +d.Average;
    })]);

    var circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle");

    circles.attr("class", "dots");
    // class to the circles - ".dots".

    circles.attr("cx", function (d) {
            return xScale(+d.U5MR);
        })
        .attr("cy", function (d) {
            return yScale(+d.Average);
        })
        .attr("r", dotRadius) // you might want to increase your dotRadius
        .attr("fill", function(d) {
        if (d.Country === "Sierra Leone" || d.Country === "Costa Rica") {
         return "#FF0000"
        } else {
        return "#0099FF"}
    })
    .attr("opacity", ".6")
    
    circles
    .on("mouseover", mouseoverFunc)
      		.on("mousemove", mousemoveFunc) 
      		.on("mouseout", mouseoutFunc); 
    
    
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
    .text("Mortality Rate");

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
    .text("avg. Contraceptive Use (%)");
    
    function mouseoverFunc(d) {
		console.log(d);
		return tooltip
			.style("display", null) // this removes the display none setting from it
			.html("<p class='sans'><span class='tooltipHeader'>" + d.Country + "</span><br>Avg. Contraceptive Use: " + d3.format(".2f")(d.Average) + "%" + "<br>Under-5 Mortality Rate: " + d.U5MR + "</p>");
		}

	function mousemoveFunc(d) {
		console.log("events", window.event, d3.event);
		return tooltip
			.style("top", (d3.event.pageY - 5) + "px" )
			.style("left", (d3.event.pageX + 15) + "px");
	}

	function mouseoutFunc(d) {
    return tooltip.style("display", "none");  // this sets it to invisible!
  }


});