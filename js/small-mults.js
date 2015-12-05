function drawMultiples() {
    var m_margin = {
            top: 10,
            right: 20,
            bottom: 30,
            left: 20
        },
        m_width = 250 - m_margin.left - m_margin.right,
        m_height = 150 - m_margin.top - m_margin.bottom;

    var dotRadius = 1;
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
    var xMax = d3.max(mixedDataset, function (d) {
        //        console.log(d);
        return +d.U5MR2014;
    });
    console.log("xMax", xMax);
    xScale.domain([0, xMax]);


    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(4);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(4)
        .orient("left");

    
    /*--------------------------------------------------------------------------
      Nesting
     --------------------------------------------------------------------------*/

    var measures = d3.keys(mixedDataset[0]).slice(7, 12); //
    console.log("MEASURES", measures);

    var newNest = [];

    measures.forEach(function (m) { // loop through all the measures in the measures array

        var vals = [];

        mixedDataset.forEach(function (d) {
            vals.push({
                "value": +d[m],
                "country": d.Country,
                "U5MR": d.U5MR2014
            });
        });

        newNest.push({
            "method": m,
            "value": vals
        });

    });
    console.log("NEWNEST", newNest);

    svg = d3.select("#vis-sub")
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

    multiples.on("click", clickMultiple);
    
    /*--------------------------------------------------------------------------
      clickMultiple()
     --------------------------------------------------------------------------*/
    function clickMultiple(d) {
        console.log("CLICKED", $(this));
        console.log("CLICKED", $(this).attr("class"));
        var vis = d3.select("#vis");
        console.log("VIS", vis);
        console.log(vis.select("svg"));
    }

    /*--------------------------------------------------------------------------
       Multiple()
      --------------------------------------------------------------------------*/
    function multiple(thisMeasure) {
        console.log("NEST", thisMeasure);
        //        console.log("MIXEDDATA", mixedDataset);
        var svg = d3.select(this);

        svg.append("rect")
            .attr("class", "background")
            .style("pointer-events", "all")
            .attr("width", width)
            .attr("height", height)
            .attr("opacity", '0');


        //
        var yMax = d3.max(mixedDataset, function (d) {
            // console.log(type.method, +d[type.method]);
            return +d[thisMeasure.method];
        });
        console.log("MAX", thisMeasure.method, yMax);

        yScale.domain([yMax, 0]);

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
                    return yScale(+d.value);
                }
            })
            .attr("r", dotRadius) // you might want to increase your dotRadius
            .attr("fill", function (d) {
                if (!isNaN(d.value) && !isNaN(d.U5MR)) {
                    return colorScale(d.U5MR);
                } else {
                    return "#fff";
                }
            })
            .attr("opacity", ".6")
            .append("title")
            .text(function (d) {
                return d.country + ", Value: " + d.value;
            });

        /*---------------------------------------------------------------------
                Axes
        ---------------------------------------------------------------------*/

        yAxis.scale(yScale);
        xAxis.scale(xScale);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (m_height - m_margin.bottom) + ")")
            .call(xAxis)
            .append("text")
            .attr("x", m_width - m_margin.right - m_margin.left)
            .attr("y", m_height)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .attr("class", "label")
            .text("");

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (m_margin.left) + ",0)")
            .call(yAxis)
            .append("text")
            .attr("x", m_margin.right)
            .attr("y", 0)
            .attr("dy", "1em")
            .style("text-anchor", "start")
            .attr("class", "label")
            .text(""/*thisMeasure.method.replace('_', ' ')*/);

        /* End Multiple() */
    }
}

/*--------------------------------------------------------------------------
    Data Variables
//  --------------------------------------------------------------------------*/
//var fertilityDataset, mortalityDataset, mixedDataset;
//
///*--------------------------------------------------------------------------
//    Loaded
//  --------------------------------------------------------------------------*/
//
//function loaded(error, fertilityData, mortalityData, mixedData) {
//    if (error) {
//        console.log(error);
//    } else {
//
//        fertilityDataset = fertilityData; // assign to global
//        mortalityDataset = mortalityData; // assign to global
//        mixedDataset = mixedData; // assign to global
//
//        drawMultiples();
//
//    }
//}
//
///*--------------------------------------------------------------------------
//    Queue in Data Files
//  --------------------------------------------------------------------------*/
//
//queue()
//    .defer(d3.csv, "data/fertilityOverTime.csv") // process
//    .defer(d3.csv, "data/median-U5MRbyCountry.csv")
//    .defer(d3.csv, "data/MultipleMapData.csv")
//    .await(loaded);