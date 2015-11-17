var margin = {
        top: 20,
        right: 150,
        bottom: 100,
        left: 40
    },
    width = 1150 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width], .5);

var yScale = d3.scale.linear()
    .rangeRound([height, 0]);

//var color = d3.scale.category20c();

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .innerTickSize([0]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickFormat(d3.format(".2s")); // for the stacked totals version

var stack = d3.layout
    .stack(); // default view is "zero" for the count display.

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var myTooltip = d3.select("body")
    .append("div")
    .attr("class", "myTooltip");

var percentClicked = false;

d3.csv("Contraceptive-Types-select-countries-2013-2014.csv", function (error, data) {

    if (error) {
        console.log(error);
    }

    data.sort(function (a, b) {
        return b["Any method"] - a["Any method"];
    });
    // how would we sort by largest total bar?  what would we have to calculate?

    var methods = d3.keys(data[0]).filter(function (d) {
        return (d !== "Country" && d !== "Year" && d !== "Age" && d !== "Any method" && d !== "Any modern method" && d !== "Any traditional method");
    });
    
    var color = d3.scale.ordinal()
.domain(methods)
.range(['#fd8d3c', '#e6550d', ' #c6dbef', '#9ecae1', '#6baed6',  '#1797E5',  '#3182bd', '#2956A8', '#19344F','#31a354', '#74c476', '#a1d99b', '#c7e9c0']);
    
    console.log("methods", methods);
    var stacked = stack(makeData(methods, data)); // needed for default view
    xScale.domain(data.map(function (d) {
        return d.Country;
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dy", ".5em")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Contraceptive Prevalence");

    var country = svg.selectAll(".country")
        .data(stacked)
        .enter().append("g")
        .attr("class", "country")
        .style("fill", function (d, i) {
//            console.log("method method", d[i].method);
            return color(d[i].method);
        });

    console.log("country", country);

    var rectangles = country.selectAll("rect")
        .data(function (d) {
//            console.log("array for a rectangle", d);
            return d;
        }) // this just gets the array for bar segment.
        .enter().append("rect")
        .attr("width", xScale.rangeBand());

    // this just draws them in the default way, now they're appended.
    transitionCount();

    drawLegend();

    d3.selectAll("input").on("change", handleFormClick);

    // All the functions for stuff above!

    function handleFormClick() {
        if (this.value === "bypercent") {
                        percentClicked = true;
            transitionPercent();
        } else {
                        percentClicked = false;
            transitionCount();
        }
    }


    function makeData(methods, data) {
        return methods.map(function (method) {
            return data.map(function (d) {
                return {
                    x: d["Country"],
                    y: +d[method],
                    method: method
                };
            })
        });
    }


    function transitionPercent() {

        yAxis.tickFormat(d3.format("%"));
        stack.offset("expand"); // use this to get it to be relative/normalized!
        var stacked = stack(makeData(methods, data));
        // call function to do the bars, which is same across both formats.
        transitionRects(stacked);
    }

    function transitionCount() {

        yAxis.tickFormat(d3.format(".2s")); // for the stacked totals version
        stack.offset("zero");
        var stacked = stack(makeData(methods, data));
        transitionRects(stacked);
        console.log("stacked", stacked);
    }

    function transitionRects(stacked) {

        // this domain is using the last of the stacked arrays, which is the last illness, and getting the max height.
        yScale.domain([0, d3.max(stacked[stacked.length - 1], function (d) {
            return d.y0 + d.y;
        })]);

        // attach new fixed data
        var country = svg.selectAll(".country")
            .data(stacked);

        // same on the rects
        country.selectAll("rect")
            .data(function (d) {
                console.log("array for a rectangle");
                return d;
            }) // this just gets the array for bar segment.

        svg.selectAll("g.country rect")
            .transition()
            .duration(250)
            .attr("x", function (d) {
                return xScale(d.x);
            })
            .attr("y", function (d) {
                return yScale(d.y0 + d.y);
            }) //
            .attr("height", function (d) {
                return yScale(d.y0) - yScale(d.y0 + d.y);
            }); // height is base - tallness

        svg.selectAll(".y.axis").transition().call(yAxis);
    }

    /*======================================================================
      Legend
    ======================================================================*/

    // Building a legend by hand, based on http://bl.ocks.org/mbostock/3886208
    function drawLegend() {

        var legend = svg.selectAll(".legend")
            .data(color.domain().slice()) // what do you think this does?
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width + 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function (d, i) {
                return methods[i];
            });
    }


    /*======================================================================
      Mouse Events
    ======================================================================*/

    rectangles
        .on("mouseover", mouseoverFunc)
        .on("mousemove", mousemoveFunc)
        .on("mouseout", mouseoutFunc);


    function mouseoverFunc(d) {
      console.log("moused over", d.x);
        if(percentClicked) {
            myTooltip
            .style("display", null)
            .html("<p><span class='tooltipHeader'>" + d.x + "</span><br>"+ d.method + ": " + d3.format("%")(d.y) + "</p>");
        } else {
                         console.log("method", d.method, "percent", d.y);
        myTooltip
            .style("display", null)
            .html("<p><span class='tooltipHeader'>" + d.x + "</span><br>"+ d.method + ": " +d.y + "%</p>");
        }
    }

    function mousemoveFunc(d) {
        myTooltip
            .style("top", (d3.event.pageY - 5) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
    }
    
    function mouseoutFunc(d) {
        return myTooltip.style("display", "none"); // this sets it to invisible!
    }

    /*======================================================================
    ======================================================================*/


});