function animatedLine() {

    var margin = {
        top: 15,
        right: 75,
        bottom: 25,
        left: 45
    };
    var width = 950 - margin.right - margin.left;
    var height = 200 - margin.bottom - margin.top;
    var datapoints = [];
    var years = [];
    var dateFormat = d3.time.format("%Y").parse;
    var data = worldMortalityDataset;
    //    console.log("AL", data);
    //    console.log("AL", data[0]);
    var MDG = 29;
    years = d3.keys(worldMortalityDataset[0]).slice(20, 46);

    console.log("Y", years);

    years.forEach(function (d) {
        //        console.log(data[0][d]);
        datapoints.push({
            x: d,
            y: +data[0][d]
        });
    });

    console.log("datapoints", datapoints);

    var xScale = d3.scale.linear().domain(d3.extent(years)).range([margin.left, width - margin.right - margin.left]).clamp(true);

    var yMax = d3.max(datapoints, function (d) {
        // console.log(type.method, +d[type.method]);
        return d.y;
    });

    var yMin = d3.min(datapoints, function (d) {
        // console.log(type.method, +d[type.method]);
        return d.y;
    });

    var yScale = d3.scale.linear().domain([0, yMax + 8]).range([height - margin.bottom, margin.top]);



    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(15)
        .tickFormat(function (d) {
            return d;
        })
        .outerTickSize([0]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5)
        .outerTickSize([0]);

    /*--------------------------------------------------------------------------
     linefunction
     --------------------------------------------------------------------------*/
    var lineFunction = d3.svg.line()
        .x(function (d) {
            return xScale(d.x)
        })
        .y(function (d) {
            //            console.log("LINE Y", d.y);
            return yScale(d.y)
        });
    /*--------------------------------------------------------------------------
       Go!
     --------------------------------------------------------------------------*/
    var svg = d3.select("#vis-sub")
        .append("svg")
        .attr("id", "animatedLine")
        .attr("width", width)
        .attr("height", height)
        .data([datapoints]);
    /*--------------------------------------------------------------------------
         Axes
      --------------------------------------------------------------------------*/
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxis)
        .append("text")
        .attr("x", width - margin.right)
        .attr("y", 5)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .attr("class", "label")
        .text("");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -60)
        .attr("y", -40)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .attr("class", "label")
        .text("U5MR");

    svg.append("text")
        .attr("class", "aside")
        .attr("x", width - margin.left - margin.right + 5)
        .attr("y", yScale(yMin) - 6)
        .attr("dy", "1em")
        .style("text-anchor", "start")
        .text("World U5MR");
    /*--------------------------------------------------------------------------
            chart insides
     --------------------------------------------------------------------------*/
    svg.append("rect")
        .attr("class", "background")
        .style("pointer-events", "all")
        .attr("width", width - margin.left - margin.right)
        .attr("height", height)
        .attr("transform", "translate(0," + (margin.top) + ")")
        .attr("opacity", 0)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

    svg.append("path")
        .attr("id", "Series1")
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .attr("d", function (d) {
            return lineFunction(d);
        });

    var path = d3.select("#Series1");
    var totalLength = path.node().getTotalLength();
    var dashed = path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength);

    dashed.transition()
        .duration(5000)
        .attrTween("stroke-dashoffset", function () {
            var interpolateline = d3.scale.linear()
                .domain([0, 1])
                .range([totalLength, 0]);

            var interpolateRound = d3.interpolateRound(1990, 2015);

            return function (t) {
                measure = "yr" + interpolateRound(t);
                changeColorMeasure(measure);
                return interpolateline(t);
            };
        });

    var yearLine = svg.append("line")
        .attr("class", "axis")
        .attr("opacity", 1)
        .attr("stroke", "#a6a6a6")
        .attr("stroke-width", 1)
        .style("pointer-events", "none");

    var caption = svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "start")
        .style("pointer-events", "none")
        .attr("dy", -8);

    var curVal = svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .style("pointer-events", "none")
        .attr("dy", 13)
        .attr("y", height);

    /*======================================================================
      MDG line
    ======================================================================*/

    svg.append("line")
        .attr("class", "MDG")
        .style("stroke-dasharray", ("3, 3"))
        .attr("x1", margin.left)
        .attr("y1", yScale(MDG))
        .attr("x2", width - margin.left - margin.right)
        .attr("y2", yScale(MDG))
        .attr("stroke", "#ebebeb");

    svg.append("text")
        .attr("class", "aside")
        .attr("x", width - margin.left - margin.right + 5)
        .attr("y", yScale(MDG) - 6)
        .attr("dy", "1em")
        .style("text-anchor", "start")
        .text("World Goal by 2015");

    /*======================================================================
      Mouse Functions
    ======================================================================*/

    function mouseover() {
        console.log(this);
        return mousemove.call(this);
    };

    function mousemove() {
        var year;
        year = Math.round(xScale.invert(d3.mouse(this)[0]));
        //        console.log("YEAR", year);

        measure = "yr" + year;
        changeColorMeasure();

        yearLine.attr("opacity", 1)
            .attr("x1", xScale(year))
            .attr("y1", yScale(0))
            .attr("x2", xScale(year))
            .attr("y2", function (c) {
                return yScale(worldMortalityDataset[0][year]);
            });
        caption.attr("x", xScale(year)).attr("y", function (c) {
            return yScale((worldMortalityDataset[0][year]));
        }).text(function (c) {
            return worldMortalityDataset[0][year] + " deaths per 1,000";
        });
        return curVal.attr("x", xScale(year)).text(year);
    };

    function mouseout() {
        measure = "yr2015";
        changeColorMeasure("yr2015");
        yearLine.attr("opacity", 0);
        caption.text("");
        return curVal.text("");
    };

}