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
    var dateFormat = d3.time.format("%Y");
    var data = worldMortalityDataset;
    //    console.log("AL", data);
    //    console.log("AL", data[0]);
    var MDG = 29;
    years = d3.keys(worldMortalityDataset[0]).slice(20, 45);

    console.log("Y", years);

    years.forEach(function (d) {
        //        console.log(data[0][d]);
        datapoints.push({
            x: d,
            y: +data[0][d]
        });
    });

    console.log(datapoints);

    var xScale = d3.scale.linear().domain(d3.extent(years)).range([margin.left, width - margin.right - margin.left]);
   
    var yMax =  d3.max(datapoints, function (d) {
            // console.log(type.method, +d[type.method]);
            return d.y;
        }); 
    
    var yMin =  d3.min(datapoints, function (d) {
            // console.log(type.method, +d[type.method]);
            return d.y;
        });
    
    var yScale = d3.scale.linear().domain([0, yMax + 10]).range([height - margin.bottom, margin.top]);


    
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
      smoothInterpolation()
     --------------------------------------------------------------------------*/
    function smoothInterpolation() {
        var interpolate = d3.scale.linear()
            .domain([0, 1])
            .range([1, datapoints.length + 1]);

        return function (t) {
            var flooredX = Math.floor(interpolate(t));
            var interpolatedLine = datapoints.slice(0, flooredX);
            //            
            //            console.log("FLOORED X", flooredX);
            //            console.log("INTERPOLATED LINE", interpolatedLine);

            if (flooredX > 0 && flooredX < datapoints.length) {
                var weight = interpolate(t) - flooredX;
                var weightedLineAverage = datapoints[flooredX].y * weight + datapoints[flooredX - 1].y * (1 - weight);
                interpolatedLine.push({
                    "x": interpolate(t) - 1,
                    "y": weightedLineAverage
                });
            }

            return lineFunction(interpolatedLine);
        }
    }
    /*--------------------------------------------------------------------------
       Go!
     --------------------------------------------------------------------------*/  
    var svg = d3.select("#vis-sub")
        .append("svg")
        .attr("id", "animatedLine")
        .attr("width", width)
        .attr("height", height);
    
    svg.append("path")
        .attr("id", "Series1")
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);
    //    .on("mouseover", mouseoverFunc)
    //        .on("mouseout", mouseoverFunc)
    //        .on("mousemove", mouseoverFunc);

    d3.select("#Series1")
        .transition()
        .duration(3000)
        .attrTween("d", smoothInterpolation);

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
        .text("Global MDG");
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
        .text("World U5MR 2014");
    /*======================================================================
      Mouse Functions
    ======================================================================*/

    //
    //    function mouseoutFunc() {
    //
    //        myTooltip.style("display", "none"); // this sets it to invisible!
    //    }

    //    function mouseoverFunc(d) {
    //        myTooltip
    //            .style("display", null) // this removes the display none setting from it
    //            .html("<p><span class='tooltipHeader sans'>X</span>" + d.x "</p>");
    //    }
    //
    //    function mousemoveFunc(d) {
    //        console.log("events", window.event, d3.event);
    //        myTooltip
    //            .style("top", (d3.event.pageY - 45) + "px")
    //            .style("left", (d3.event.pageX + 5) + "px");
    //    }

}