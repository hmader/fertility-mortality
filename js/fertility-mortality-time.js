/*======================================================================
 Fertility-Mortality Scatter Plot Over Time
======================================================================*/

function drawFMOverTime() {
    /*--------------------------------------------------------------------------
       Setup vars
      --------------------------------------------------------------------------*/
    var dotRadius = 6;
    var dotOpacity = .7;
    var startYear = 1970,
        filterValue = 1970;
    /*--------------------------------------------------------------------------
       Scale, Axis Variables & Setup
      --------------------------------------------------------------------------*/
    /* range is what we are mapping TO, so we want it to be the chart area
       domain is what we are mapping FROM, so it's what we want from the dataset */
    var xMax = 425;
    var yMax = 9;

    var xScale = d3.scale.linear()
        .range([margin.left, width]);
    var yScale = d3.scale.linear()
        .range([margin.top, height - margin.bottom]);
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(12);
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(10)
        .orient("left");

    xScale.domain([0, xMax]);
    yScale.domain([yMax, 0]);
    
    svg = d3.select('#vis').append('svg')
        .attr('width', width)
        .attr('height', height);

    /*--------------------------------------------------------------------------
       Data Variables
      --------------------------------------------------------------------------*/
    //    var fertilityDataset, mortalityDataset;
    var data;
    var countries = [];
    var prenest = [];
    var nest = [];
    var years = [];

    /*--------------------------------------------------------------------------
       Color Scale
      --------------------------------------------------------------------------*/
    var colorScale = d3.scale.linear().range(["#0099FF", "#FF0000"]).interpolate(d3.interpolateLab);

    function setColorDomain() {
        colorScale.domain([0, 400]);
    }
    /*--------------------------------------------------------------------------
       Slider
      --------------------------------------------------------------------------*/
    // see examples in http://www.macwright.org/chroniton/example/
    var slider = chroniton()
        .domain([dateFormat.parse("1970"), dateFormat.parse("2013")])
        .labelFormat(d3.time.format('%Y'))
        .width(500)
        .height(50)
        .playButton(true) // can also be set to loop
        .on("change", function (d) {
            filterValue = dateFormat(d3.time.year(d));
            console.log("filterValue", filterValue);
            redraw(filterValue);
            // logic here is check if it's "playing", and if value is 
            // 2013, then set value to 1970 and stop it
        });

    function drawSlider() {
        d3.select("#slider")
            .call(slider);
    }

    /*---------------------------------------------------------------------
     drawAxes()
    ---------------------------------------------------------------------*/
    function drawAxes() {
        yAxis.scale(yScale);
        xAxis.scale(xScale);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call(xAxis)
            .append("text")
            .attr("x", width)
            .attr("y", -20)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .attr("class", "label")
            .text("Under-5 Mortality Rate (U5MR)");

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (margin.left) + ",0)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -margin.top)
            .attr("y", 5)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .attr("class", "label")
            .text("Fertility Rate");
    }
    /*--------------------------------------------------------------------------
       Queue in Data Files
      --------------------------------------------------------------------------*/
    // we use queue because we have 2 data files to load.
    //    queue()
    //        .defer(d3.csv, "data/fertilityOverTime.csv") // process
    //        .defer(d3.csv, "data/median-U5MRbyCountry.csv")
    //        .await(loaded);

    /*--------------------------------------------------------------------------
       Change Functions
      --------------------------------------------------------------------------*/
    function getData(d) {
        var dataRow = countryById.get(d.properties.adm0_a3_is); // best match
        var dataVal = null;
        // must be a more elegant way to do this with all the checks, but i'm tired
        if (dataRow) {
            dataVal = data.get(dataRow.ShortName);
        }
        if (dataVal) {
            console.log("dataVal shortname", dataVal[0].Country);
            dataVal = dataVal.filter(function (d) {
                return d.Year == filterValue;
            });
        }
        if (dataVal) {
            dataVal = dataVal[0];
        }
        return dataVal;
    }

    function getColor(d) {
        var dataVal = getData(d);
        if (dataVal) {
            return colorScale(dataVal.fertility);
        }
        // if we fall through, i.e., no match
        //console.log("no dataRow", d);
        return "#ccc";
    }

    function getText(d) {
        var dataVal = getData(d);
        if (dataVal) {
            return dataVal.country + ": " + dataVal.fertility;
        } else {
            return d.properties.name + ": No data.";
        }
    }


    /*--------------------------------------------------------------------------
       nestData()
      --------------------------------------------------------------------------*/
    function nestData(d) {

        years = d3.keys(mortalityDataset[0]).slice(21, 65); //
        //    console.log(years);

        mortalityDataset.forEach(function (d) {
            countries.push(d.Country);
        });
        //    console.log("countries[] array", countries);

        mortalityDataset.forEach(function (m, i) {
            //        console.log("M", m);
            //        console.log("COUNTRY", m.Country);

            var f = fertilityDataset.filter(function (d) {
                return d.Country == m.Country;
            });
            //        console.log("FERTILITY ROW", f);

            if (f[0]) {
                // console.log("MATCHING COUNTRY", m.Country, f);
                years.forEach(function (y) {

                    prenest.push({
                        country: m.Country,
                        year: y,
                        mRate: m[y],
                        fRate: f[0][y]
                    });
                    // console.log("YEAR - This is the current year of the loop", y); 
                    // console.log("Value - This is the mortality rate value at the current country and year of the loops", m.Country, y, m[y]); 
                    // console.log("F-VALUE - this is the current fertility rate value of the year and country", f[0][y]);
                });
            } else {
                console.log("NO MATCHING COUNTRY NAME", m.Country, f);
            }
        });

        //    console.log("PRENEST", prenest);

        //     nest = d3.nest()
        //                .key(function (d) {
        //                    return d.year;
        //                })
        //                .entries(prenest);

        nest = d3.nest()
            .key(function (d) {
                return d.year;
            })
            .map(prenest, d3.map);

        //    console.log("NEST", nest);
    }
    /*--------------------------------------------------------------------------
       drawScatter()
      --------------------------------------------------------------------------*/
    function drawScatter(year) {
        var year = "yr" + year;
        console.log(year);
        var yearData = nest.get(year);
        console.log(yearData);
        /*---------------------------------------------------------------------
                  Circles
          ---------------------------------------------------------------------*/
        var circles = svg.selectAll("circle")
            .data(yearData)
            .enter()
            .append("circle")
            .attr("class", "dots");

        circles.attr("cx", function (d) {
                if (!isNaN(d.mRate)) {
                    return xScale(+d.mRate);
                }
            })
            .attr("cy", function (d) {
                if (!isNaN(d.fRate)) {
                    return yScale(+d.fRate);
                }
            })
            .attr("r", dotRadius) // you might want to increase your dotRadius
            .attr("fill", function (d) {
                return colorScale(d.mRate);
            })
            .attr("opacity", function (d) {
                if ((d.fRate) && (d.mRate)) {
                    return dotOpacity;
                } else {
                    return 0;
                }
            });

        circles.on("mouseover", mouseoverFunc)
            .on("mouseout", mouseoutFunc)
            .on("mousemove", mousemoveFunc)
    }
    
    /*--------------------------------------------------------------------------
       redraw()
      --------------------------------------------------------------------------*/
    function redraw(year) {

        var year = "yr" + year;
        console.log(nest.get(year));
        var circles = svg.selectAll("circle.dots")
            .data(nest.get(year));
        console.log(svg);

        console.log(circles);

        circles.attr("fill", function (d) {
            if (!(d.fRate) || !(d.mRate)) {
                return "rgba(0, 0, 0, 0)";
            } else {
                return colorScale(d.mRate);
            }
        });

        circles.exit()
            .transition()
            .duration(100)
            .ease("exp")
            .attr("r", 0)
            .remove();
        // transition -- move to proper widths and location
        circles.transition()
            .duration(100)
            .ease("quad")
            .attr("cx", function (d) {
                if (!isNaN(d.mRate)) {
                    return xScale(+d.mRate);
                }
            })
            .attr("cy", function (d) {
                if (!isNaN(d.fRate)) {
                    return yScale(+d.fRate);
                }
            })
            .attr("r", dotRadius) // you might want to increase your dotRadius
            .attr("fill", function (d) {
                return colorScale(d.mRate);
            })
            .attr("opacity", function (d) {
                if ((d.fRate) && (d.mRate)) {
                    return dotOpacity;
                } else {
                    return 0;
                }
            });

    } // end of draw function
    /*--------------------------------------------------------------------------
       Mouse Events
      --------------------------------------------------------------------------*/

    function mouseoverFunc(d) {
        var toolstring = "U5MR: " + d.mRate + "<br>Fertility Rate: " + d.fRate;
        myTooltip
            .style("opacity", 1)
            .style("display", null)
            .html("<p><span class='tooltipHeader'>" + d.country + "</span><br>" + toolstring + "<br></p>");
    }

    function mousemoveFunc(d) {
        return myTooltip
            .style("top", (d3.event.pageY - 5) + "px")
            .style("left", (d3.event.pageX + 15) + "px");
    }

    function mouseoutFunc(d) {
        return myTooltip.style("display", "none"); // this sets it to invisible!
    }
    /*--------------------------------------------------------------------------
           Call the functions
    --------------------------------------------------------------------------*/

    nestData();
    setColorDomain();
    drawAxes();
    drawSlider();
    drawScatter(startYear);
}
/*======================================================================
    ======================================================================*/