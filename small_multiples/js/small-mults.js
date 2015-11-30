function drawMultiples() {

    var m_margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 20
        },
        m_width = 500 - m_margin.left - m_margin.right,
        m_height = 300 - m_margin.top - m_margin.bottom;

    var dotRadius = 5;
    /*--------------------------------------------------------------------------
        Scale Variables & Setup
      --------------------------------------------------------------------------*/
    /* range is what we are mapping TO, so we want it to be the chart area
   domain is what we are mapping FROM, so it's what we want from the dataset */

    var xScale = d3.scale.linear()
        .range([m_margin.left, m_width]);
    var yScale = d3.scale.linear()
        .range([m_margin.top, m_height]);
    var xMax = d3.max(mixedDataset, function (d) {
        //        console.log(d);
        return +d.U5MR2014;
    });
    console.log("xMax", xMax);
    xScale.domain([0, xMax]);


    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(5)
        .orient("left");

    /*--------------------------------------------------------------------------
      Nesting
     --------------------------------------------------------------------------*/

    var measures = d3.keys(mixedDataset[0]).slice(4, 11); //
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

    var svg = d3.select("#vis0").selectAll("svg")
        .data(newNest)
        .enter().append("svg")
        .attr("width", m_width)
        .attr("height", m_height)
        .append("g")
        .attr("transform", "translate(" + m_margin.left + "," + m_margin.top + ")")
        .each(multiple); // uses each to call the multiple code for each measure


    /*--------------------------------------------------------------------------
       Multiple()
      --------------------------------------------------------------------------*/
    function multiple(thisMeasure) {
        console.log("NEST", thisMeasure);
        //        console.log("MIXEDDATA", mixedDataset);
        var svg = d3.select(this);

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
                if (!isNaN(d.U5MR)) {
                    return xScale(+d.U5MR);
                }
            })
            .attr("cy", function (d) {
                if (!isNaN(d.value)) {
                    return yScale(+d.value);
                }
            })
            .attr("r", dotRadius) // you might want to increase your dotRadius
            .attr("fill", function (d) {
                if (!isNaN(d.value) && !isNaN(d.U5MR)) {
                    return "red";
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


        //        svg.append("rect")
        //            .attr("class", "background")
        //            .style("pointer-events", "all")
        //            .attr("width", m_width)
        //            .attr("height", m_height)
        //            .attr("opacity", '.2')
        //            .attr("fill", "red");

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
            .text(thisMeasure.method);

        /* End Multiple() */
    }
}

/*--------------------------------------------------------------------------
    Data Variables
  --------------------------------------------------------------------------*/
var fertilityDataset, mortalityDataset, mixedDataset;

/*--------------------------------------------------------------------------
    Loaded
  --------------------------------------------------------------------------*/

function loaded(error, fertilityData, mortalityData, mixedData) {
    if (error) {
        console.log(error);
    } else {

        fertilityDataset = fertilityData; // assign to global
        mortalityDataset = mortalityData; // assign to global
        mixedDataset = mixedData; // assign to global

        drawMultiples();

    }
}

/*--------------------------------------------------------------------------
    Queue in Data Files
  --------------------------------------------------------------------------*/

queue()
    .defer(d3.csv, "data/fertilityOverTime.csv") // process
    .defer(d3.csv, "data/median-U5MRbyCountry.csv")
    .defer(d3.csv, "data/MultipleMapData.csv")
    .await(loaded);