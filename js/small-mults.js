function drawMultiples() {
    var m_margin = {
            top: 10,
            right: 20,
            bottom: 70,
            left: 20
        },
        m_width = 300 - m_margin.left - m_margin.right,
        m_height = 275 - m_margin.top - m_margin.bottom;

    var dotRadius = 2;
    var highlight = "";

    var rs = [{
        "Fertility_Rate": .861,
        "Health_Expenditure_Per_Capita": -.433,
        "Contraceptive_Prevalence": -.804,
        "Percent_Below_Poverty_Line": .657,
        "Secondary_Edu_Attendance": -.776,
        "Primary_Edu_Attendance": -.777

    }]

    console.log("RS", rs);
    /*--------------------------------------------------------------------------
           Color Scale
    --------------------------------------------------------------------------*/
    var colorScale = d3.scale.linear().range(["#0099FF", "#FF0000"]).interpolate(d3.interpolateLab);

    colorScale.domain([0, 400]);


    /*--------------------------------------------------------------------------
        Scale Variables & Setup
      --------------------------------------------------------------------------*/
    /* range is what we are mapping TO, so we want it to be the chart area
   domain is what we are mapping FROM, so it's what we want from the dataset */

    var xScale = d3.scale.linear()
        .range([m_margin.left, m_width]);
    var yScale = d3.scale.linear()
        .range([m_margin.top, m_height - m_margin.bottom]);
    var yScalePow = d3.scale.sqrt()
        .range([m_margin.top, m_height - m_margin.bottom]);
    var xMax = d3.max(mixedDataset, function (d) {
        //        console.log(d);
        return +d.U5MR2013;
    });
    console.log("xMax", xMax);
    xScale.domain([0, xMax]);


    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(0);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(0)
        .orient("left");

    /*--------------------------------------------------------------------------
      Nesting
     --------------------------------------------------------------------------*/

    var measures = d3.keys(mixedDataset[0]).slice(8, 14); //
    console.log("MEASURES", measures);

    var newNest = [];

    measures.forEach(function (m) { // loop through all the measures in the measures array

        var vals = [];

        mixedDataset.forEach(function (d) {
            if (!isNaN(d[m]) && !isNaN(d.U5MR2013)) {
                vals.push({
                    "value": +d[m],
                    "country": d.Country,
                    "U5MR": d.U5MR2013
                });
            }
        });

        newNest.push({
            "method": m,
            "value": vals
        });

    });
    console.log("NEWNEST", newNest);

    svg = d3.select("#vis")
        .attr('width', width)
        .attr('height', height);

    var multiples = svg.selectAll("svg.multiple")
        .data(newNest)
        .enter().append("svg")
        .attr("width", m_width)
        .attr("height", m_height)
        .attr("class", "multiple")
        .append("g")
        .attr("class", function (d) {
            console.log("CLASS", d.method);
            return d.method;
        })
        .attr("transform", "translate(" + m_margin.left + "," + m_margin.top + ")")
        .each(multiple); // uses each to call the multiple code for each measure

    /*--------------------------------------------------------------------------
       Multiple()
      --------------------------------------------------------------------------*/
    function multiple(thisMeasure) {

        var y_Scale = yScale;
        //        if (thisMeasure.method === "Health_Expenditure_Per_Capita") {
        //            y_Scale = yScalePow;
        //        }
        console.log("NEST", thisMeasure);
        //        console.log("MIXEDDATA", mixedDataset);
        var svg = d3.select(this);

        svg.append("rect")
            .attr("class", "background")
            .style("pointer-events", "all")
            .attr("width", m_width - m_margin.left - m_margin.right)
            .attr("height", m_height - m_margin.top - m_margin.bottom)
            .attr("transform", "translate(" + (m_margin.left) + "," + (m_margin.top) + ")")
            .attr("fill", "#f2f2f2")
            .attr("opacity", '.5');

        var yMax = d3.max(mixedDataset, function (d) {
            // console.log(type.method, +d[type.method]);
            return +d[thisMeasure.method];
        });
        console.log("MAX", thisMeasure.method, yMax);

        y_Scale.domain([yMax + .1 * yMax, 0]);

        /*---------------------------------------------------------------------
                Axes
        ---------------------------------------------------------------------*/
        yAxis.scale(y_Scale);
        xAxis.scale(xScale);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (m_height - m_margin.bottom) + ")")
            .call(xAxis)
            .append("text")
            .attr("x", m_width - m_margin.right - 5)
            .attr("y", -15)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .attr("class", "axis")
            .text("U5MR");

        yaxis = svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (m_margin.left) + ",0)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -16)
            .attr("y", 3)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .attr("class", "axis")
            .text("Factor");


        svg.append("text")
            .attr("x", m_margin.left - 2)
            .attr("y", m_height - 55)
            .attr("dy", "1em")
            .style("text-anchor", "start")
            .attr("class", "multFactor")
            .attr("fill", "#808080")
            .text("Factor: " + thisMeasure.method.replace('_', ' '));


        /*---------------------------------------------------------------------
                Circles
        ---------------------------------------------------------------------*/
        var circles = svg.selectAll("circle")
            .data(thisMeasure.value)
            .enter()
            .append("circle");

        circles.attr("cx", function (d) {
                if (!isNaN(d.U5MR) && !isNaN(d.U5MR)) {
                    return xScale(+d.U5MR);
                }
            })
            .attr("cy", function (d) {
                if (!isNaN(d.value) && !isNaN(d.U5MR)) {
                    return y_Scale(+d.value);
                }
            })
            .attr("r", dotRadius) // you might want to increase your dotRadius
            .attr("fill", "#0099FF")
            .attr("opacity", ".6")
            .attr("class", function (d) {
                return "dot_" + d.country.replace(/\s/g, '_');
            });

        circles.classed("dots", true);

        circles.on("mouseover", mouseoverFunc)
            .on("mouseout", mouseoutFunc)
            .on("mousemove", mousemoveFunc);
        /*---------------------------------------------------------------------
                      Trendline
               ---------------------------------------------------------------------*/
        var myArray = [];
        var a0 = 0;
        var b0 = 0;
        var b1 = 0;
        var c1 = 0;

        thisMeasure.value.forEach(function (d, i) {
            myArray.push([+d.U5MR, +d.value]);
            a0 = myArray[i][0] * myArray[i][1] + a0;
            b0 = myArray[i][0] + b0;
            b1 = myArray[i][1] + b1;
            c1 = myArray[i][0] * myArray[i][0] + c1;
        });
        console.log("MYARRAY", myArray);

        var a = myArray.length * a0;
        var b = b0 * b1;
        var c = myArray.length * c1;
        var d = b0 * b0;
        var slope = (a - b) / (c - d)
        var e = b1;
        var f = slope * b0;
        var intercept = (e - f) / myArray.length;
        var x1 = d3.min(myArray, function (d) {
            // console.log(type.method, +d[type.method]);
            return +d[0];
        });
        var y1 = x1 * slope + intercept;
        var x2 = d3.max(myArray, function (d) {
            if (thisMeasure.method == "Health_Expenditure_Per_Capita") {
                return 73;
            } else if (thisMeasure.method == "Contraceptive_Prevalence") {
                return 120;
            } else {
                // console.log(type.method, +d[type.method]);
                return +d[0];
            }
        });
        var y2 = slope * x2 + intercept;
        var trendData = [[x1, y1, x2, y2]];
        console.log("TRENDDATA", trendData);

        var trendline = svg.selectAll(".trendline")
            .data(trendData);

        trendline.enter()
            .append("line")
            .attr("class", "trendline")
            .attr("x1", function (d) {
                return xScale(d[0]);
            })
            .attr("y1", function (d) {
                return yScale(d[1]);
            })
            .attr("x2", function (d) {
                return xScale(d[2]);
            })
            .attr("y2", function (d) {
                return yScale(d[3]);
            })
            .attr("stroke", "grey")
            .attr("stroke-width", 1)
            .attr("opacity", 0);

        var rvalue = svg.append("text")
            .attr("x", m_margin.left - 2)
            .attr("y", m_height - 40)
            .attr("dy", "1em")
            .style("text-anchor", "start")
            .attr("class", "rvalue")
            .text("r-value: " + rs[0][thisMeasure.method])
            .attr("fill", function () {
                if (thisMeasure.method === "Fertility_Rate") {
                    return "#0099FF";
                } else {
                    return "#808080";
                }
            })
            .attr("opacity", 0);

        /*---------------------------------------------------------------------
             Mouse Events
        ---------------------------------------------------------------------*/

        function mouseoverFunc(d) {
            console.log(this);
            var dotClass = "circle.dot_" + d.country.replace(/\s/g, '_');
            d3.selectAll(dotClass).attr("r", 3 * dotRadius / 2).classed("red", true);
            myTooltip
                .style("opacity", 1)
                .style("display", null)
                .html("<p><span class='tooltipHeader'>" + d.country + "</span></p>");
        }

        function mousemoveFunc(d) {
            return myTooltip
                .style("top", (d3.event.pageY - 5) + "px")
                .style("left", (d3.event.pageX + 15) + "px");
        }

        function mouseoutFunc(d) {
            var dotClass = "circle.dot_" + d.country.replace(/\s/g, '_');
            d3.selectAll(dotClass).attr("r", dotRadius).classed("red", false);
            return myTooltip.style("display", "none"); // this sets it to invisible!
        }

    }
}
/*========================================================================
     leastSquares()
========================================================================*/

function leastSquares(xSeries, ySeries) {
    var reduceSumFunc = function (prev, cur) {
        return prev + cur;
    };

    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    var ssXX = xSeries.map(function (d) {
            return Math.pow(d - xBar, 2);
        })
        .reduce(reduceSumFunc);

    var ssYY = ySeries.map(function (d) {
            return Math.pow(d - yBar, 2);
        })
        .reduce(reduceSumFunc);

    var ssXY = xSeries.map(function (d, i) {
            return (d - xBar) * (ySeries[i] - yBar);
        })
        .reduce(reduceSumFunc);

    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

    return [slope, intercept, rSquare];
}