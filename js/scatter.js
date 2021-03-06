function drawScatter(variable) {

    var measure = variable;
    var half_margin = {
            top: 10,
            right: 0,
            bottom: 30,
            left: 30
        },
        half_width = width,
        half_height = 3 * height / 5;

    var dotRadius = 4;

    var xScale = d3.scale.linear()
        .range([half_margin.left, half_width - half_margin.left - half_margin.right]); //--- range is what we are mapping TO, so we want it to be the chart area


    var yScale = d3.scale.linear()
        .range([half_height - half_margin.bottom, half_margin.top]); //--- range is what we are mapping TO, so we want it to be the chart area


    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    svg = d3.select('#vis').append('svg')
        .attr('width', half_width)
        .attr('height', half_height);

    /*--------------------------------------------------------------------------
           Color Scale
    --------------------------------------------------------------------------*/
    var colorScale = d3.scale.linear().range(["#0099FF", "#FF0000"]).interpolate(d3.interpolateLab);

    colorScale.domain([0, 400]);

    /*--------------------------------------------------------------------------
            drawAxes()
         --------------------------------------------------------------------------*/
    function drawAxes() {
        xScale.domain([0, d3.max(mixedDataset, function (d) {
            return +d.U5MR2014;
        })]);

        yScale.domain([0, d3.max(mixedDataset, function (d) {
            return +d[measure];
        })]);

        // fix these translates so they use your margin and height width as needed
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (half_height - half_margin.bottom) + ")")
            .call(xAxis)
            .append("text")
            .attr("x", half_width - half_margin.right - half_margin.left)
            .attr("y", -20)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .attr("class", "label")
            .text("U5MR");

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (half_margin.left) + ",0)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -10)
            .attr("y", 5)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .attr("class", "label")
            .text(measure.replace('_', ' '));

    }
    /*--------------------------------------------------------------------------
            drawCircles()
         --------------------------------------------------------------------------*/
    function drawCircles() {
        var circles = svg.selectAll("circle")
            .data(mixedDataset)
            .enter()
            .append("circle");

        circles.attr("class", function(d) {
            console.log("DOT CLASS", "dot_" + d.Country.replace(/\s/g, '_'));
         return "dot_" + d.Country.replace(/\s/g, '_');   
        });
        // class to the circles - ".dots".

        circles.attr("cx", function (d) {
                if (!isNaN(d.U5MR2014) && !isNaN(d[measure])) {
                    return xScale(+d.U5MR2014);
                }
            })
            .attr("cy", function (d) {
                if (!isNaN(d.U5MR2014) && !isNaN(d[measure])) {
                    return yScale(+d[measure]);
                }
            })
            .attr("r", dotRadius) // you might want to increase your dotRadius
            .attr("fill", function (d) {
                if (!isNaN(d.U5MR2014) && !isNaN(d[measure])) {
                    return colorScale(d.U5MR2014);
                } else {
                    return "#fff";
                }
            })
            .attr("opacity", ".6");
        
        circles.on("mouseover", mouseoverFunc)
            .on("mouseout", mouseoutFunc)
            .on("mousemove", mousemoveFunc);
    }

    /*--------------------------------------------------------------------------
      Mouse Events
     --------------------------------------------------------------------------*/

    function mouseoverFunc(d) {
        
        var dotClass = "circle.dot_" + d.Country.replace(/\s/g, '_');
        d3.selectAll(dotClass).attr("r", 3*dotRadius/2).classed("red", true);
        
        var toolstring = "U5MR: " + d.U5MR2014 + "<br>" + measure.replace('_', ' ') + " " + d[measure];
        myTooltip
            .style("opacity", 1)
            .style("display", null)
            .html("<p><span class='tooltipHeader'>" + d.Country + "</span><br>" + toolstring + "<br></p>");
    }

    function mousemoveFunc(d) {
        return myTooltip
            .style("top", (d3.event.pageY - 5) + "px")
            .style("left", (d3.event.pageX + 15) + "px");
    }

    function mouseoutFunc(d) {
        var dotClass = "circle.dot_" + d.Country.replace(/\s/g, '_');
        d3.selectAll(dotClass).attr("r", dotRadius).classed("red", false);
        return myTooltip.style("display", "none"); // this sets it to invisible!
    }
    /*--------------------------------------------------------------------------
          redraw()
    --------------------------------------------------------------------------*/

//    function redraw(rateSelect) {
//
//        console.log("clicked" + rateSelect);
//        xScale.domain([0, d3.max(data, function (d) {
//            return +d.TeenBirthRate;
//        })]);
//
//        yScale.domain([0, d3.max(data, function (d) {
//            return +d[rateSelect];
//        })]);
//
//        var circles = svg.selectAll("circle")
//            .data(data);
//
//        circles.attr("fill", function (d) {
//            if (d.abstinence == "stress") {
//                return "#FF0000";
//            } else if (d.abstinence == "cover") {
//                return "#0099FF";
//            } else {
//                return "#ccc";
//            }
//        });
//
//        //        circles.attr("fill", function (d) {
//        //            if (d.noContraceptiveUse == "null") {
//        //                return "#ccc";
//        //            } else if (d.noContraceptiveUse >= 13) {
//        //                return "#FF0000";
//        //            } else if (d.noContraceptiveUse < 13) {
//        //                return "#0099FF";
//        //            }
//        //        });
//
//        //        circles.attr("fill", function (d) {
//        //             if (d.contraceptionEduRequired == "FALSE") {
//        //                return "#FF0000";
//        //            } else if (d.contraceptionEduRequired == "TRUE") {
//        //                return "#0099FF";
//        //            } else {
//        //                return "#ccc";
//        //            }
//        //        });
//
//        circles.exit()
//            .transition()
//            .duration(500)
//            .ease("exp")
//            .attr("r", 0)
//            //TODO: what goes here at the end of exit?
//            .remove();
//
//        // transition -- move to proper widths and location
//        circles.transition()
//            .duration(500)
//            .ease("quad")
//            .attr("cx", function (d) {
//                return xScale(+d.TeenBirthRate);
//            })
//            .attr("cy", function (d) {
//                return yScale(+d[rateSelect]);
//            })
//            .attr("r", dotRadius);
//
//        // Include axes that transition.
//        // Update the axes - also animated. this is really easy.
//        svg.select(".x.axis")
//            .transition()
//            .duration(750)
//            .call(xAxis);
//
//        // Update Y Axis
//        svg.select(".y.axis")
//            .transition()
//            .duration(750)
//            .call(yAxis);
//    } // end of redraw function
    /*--------------------------------------------------------------------------
          call the functions
    --------------------------------------------------------------------------*/
    
    drawAxes();
    drawCircles();

}