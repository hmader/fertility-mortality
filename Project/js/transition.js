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

window.onload = function () {
    document.getElementById("CMR").className = "selected";
};

d3.csv("data/StateData.csv", function (data) {

    xScale.domain([0, d3.max(data, function (d) {
        return +d.TeenBirthRate;
    })]);

    yScale.domain([0, d3.max(data, function (d) {
        return +d.childMortalityRate;
    })]);

    var circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle");

    circles.attr("class", "dots");
    // class to the circles - ".dots".

    circles.attr("cx", function (d) {
            return xScale(d.TeenBirthRate);
        })
        .attr("cy", function (d) {
            return yScale(d.childMortalityRate);
        })
        .attr("r", dotRadius) // you might want to increase your dotRadius
        .attr("fill", function (d) {
                        if (d.abstinence == "stress") {
                            return "#FF0000";
                        } else if (d.abstinence == "cover") {
                            return "#0099FF";
                        } else {
                            return "#ccc";
                        }

//            if (d.noContraceptiveUse == "null") {
//                return "#ccc";
//            } else if (d.noContraceptiveUse >= 13) {
//                return "#FF0000";
//            } else if (d.noContraceptiveUse < 13) {
//                return "#0099FF";
//            }

            //             if (d.contraceptionEduRequired == "FALSE") {
            //                return "#FF0000";
            //            } else if (d.contraceptionEduRequired == "TRUE") {
            //                return "#0099FF";
            //            } else {
            //                return "#ccc";
            //            }
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
        .text("Teen Birth Rate");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (margin.left) + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -50)
        .attr("y", 5)
        .attr("dy", "1em");
    //        .style("text-anchor", "end")
    //        .attr("class", "label")
    //        .text("Mortality Rate");


    var clicked = "childMortalityRate";
    var switchText = "Child Mortality Rate: ";
    var postText = "";
    //setup our ui buttons:
    d3.select("#CMR")
        .on("click", function (d, i) {
            document.getElementById("IMR").className = "";
            document.getElementById("childPoverty").className = "";
            this.className = "selected";
            clicked = "childMortalityRate";
            switchText = "Child Mortality Rate: ";
            postText = "";
            redraw("childMortalityRate");
        });
    d3.select("#IMR")
        .on("click", function (d, i) {
            document.getElementById("CMR").className = "";
            document.getElementById("childPoverty").className = "";
            this.className = "selected";
            switchText = "Infant Mortality Rate: ";
            clicked = "IMR";
            postText = "";
            redraw("IMR");
        });

    d3.select("#childPoverty")
        .on("click", function (d, i) {
            document.getElementById("CMR").className = "";
            document.getElementById("IMR").className = "";
            this.className = "selected";
            switchText = "Child Poverty Level: ";
            clicked = "povertyLevelasPercent";
            postText = "%";
            redraw("povertyLevelasPercent");
        });

    function mouseoverFunc(d) {
        console.log(d);
        return tooltip
            .style("display", null) // this removes the display none setting from it
            .html("<p class='sans'><span class='tooltipHeader'>" + d.State + "</span><br>Teen Birth Rate: " + d.TeenBirthRate + "<br>" + switchText + +d[clicked] + postText + "</p>");
    }

    function mousemoveFunc(d) {
        console.log("events", window.event, d3.event);
        return tooltip
            .style("top", (d3.event.pageY - 5) + "px")
            .style("left", (d3.event.pageX + 15) + "px");
    }

    function mouseoutFunc(d) {
        return tooltip.style("display", "none"); // this sets it to invisible!
    }

    function redraw(rateSelect) {

        console.log("clicked" + rateSelect);
        xScale.domain([0, d3.max(data, function (d) {
            return +d.TeenBirthRate;
        })]);

        yScale.domain([0, d3.max(data, function (d) {
            return +d[rateSelect];
        })]);

        var circles = svg.selectAll("circle")
            .data(data);

                circles.attr("fill", function (d) {
                     if (d.abstinence == "stress") {
                        return "#FF0000";
                    } else if (d.abstinence == "cover") {
                        return "#0099FF";
                    } else {
                        return "#ccc";
                    }
                });
                
//        circles.attr("fill", function (d) {
//            if (d.noContraceptiveUse == "null") {
//                return "#ccc";
//            } else if (d.noContraceptiveUse >= 13) {
//                return "#FF0000";
//            } else if (d.noContraceptiveUse < 13) {
//                return "#0099FF";
//            }
//        });

        //        circles.attr("fill", function (d) {
        //             if (d.contraceptionEduRequired == "FALSE") {
        //                return "#FF0000";
        //            } else if (d.contraceptionEduRequired == "TRUE") {
        //                return "#0099FF";
        //            } else {
        //                return "#ccc";
        //            }
        //        });

        circles.exit()
            .transition()
            .duration(500)
            .ease("exp")
            .attr("r", 0)
            //TODO: what goes here at the end of exit?
            .remove();

        // transition -- move to proper widths and location
        circles.transition()
            .duration(500)
            .ease("quad")
            .attr("cx", function (d) {
                return xScale(+d.TeenBirthRate);
            })
            .attr("cy", function (d) {
                return yScale(+d[rateSelect]);
            })
            .attr("r", dotRadius);

        // Include axes that transition.
        // Update the axes - also animated. this is really easy.
        svg.select(".x.axis")
            .transition()
            .duration(750)
            .call(xAxis);

        // Update Y Axis
        svg.select(".y.axis")
            .transition()
            .duration(750)
            .call(yAxis);
    } // end of draw function


});