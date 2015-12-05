function mortalityOverTime(data) {
    console.log(data);

    //Set up date formatting and years
    var dateFormat = d3.time.format("%Y");
    var dataset = [];

    //Set up scales
    var xScale = d3.time.scale()
        .range([margin.left, width - margin.right - margin.left]);

    var yScale = d3.scale.linear()
        .range([margin.top, height - margin.bottom]);

    //Configure axis generators
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(15)
        .tickFormat(function (d) {
            return dateFormat(d);
        })
        .outerTickSize([0]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .outerTickSize([0]);

    //Configure line generator
    // each line dataset must have a d.year and a d.amount for this to work.
    var line = d3.svg.line()
        .x(function (d) {
            return xScale(dateFormat.parse(d.year.slice(2, 6)));
        })
        .y(function (d) {
            return yScale(+d.rate);
        });


    svg = d3.select('#vis').append('svg')
        .attr('width', width)
        .attr('height', height);

    var years = d3.keys(data[0]).slice(21, 65); //
    console.log(years);
    /*---------------------------------------------------------------------
      Nest Data
   ---------------------------------------------------------------------*/
    function nestData() {
        //Loop once for each row in data
        data.forEach(function (d, i) {
            var Rs = [];

            years.forEach(function (y) { //Loop through all the years - and get the rates for this data element

                if (d[y]) { /// What we are checking is if the "y" value - the year string from our array, which would translate to a column in our csv file - is empty or not.

                    Rs.push({ //Add a new object to the new rates data array - for year, rate. These are OBJECTS that we are pushing onto the array
                        year: y,
                        rate: d[y], // this is the value for, for example, d["2004"]
                        Country: d.Country
                    });
                }

            });

            dataset.push({ // At this point we are accessing one index of data from our original csv "data", above and we have created an array of year and rate data from this index. We then create a new object with the Country value from this index and the array that we have made from this index.
                country: d.Country,
                rates: Rs // we just built this from the current index.
            });

        });
    }

    /*---------------------------------------------------------------------
        setScalesDomain()
      ---------------------------------------------------------------------*/
    function setScalesDomain() {
        xScale.domain(
            d3.extent(years, function (d) {
                return dateFormat.parse(d.slice(2, 6));
            }));

        // max of rates to 0 (reversed, remember)
        yScale.domain([
    	d3.max(dataset, function (d) {
                return d3.max(d.rates, function (d) {
                    return +d.rate;
                });
            }),
        0
    ]);
    }
    /*---------------------------------------------------------------------
      drawLines()
    ---------------------------------------------------------------------*/
    //Make a group for each country
    function drawLines() {
        var groups = svg.selectAll("g.lines")
            .data(dataset)
            .enter()
            .append("g")
            .attr("class", "lines");

        //Within each group, create a new line/path,
        //binding just the rates data to each one
        groups.selectAll("path")
            .data(function (d) { // because there's a group with data already...
                return [d.rates]; // it has to be an array for the line function
            })
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", "#0099FF");
    }

    /*---------------------------------------------------------------------
      drawAxes()
    ---------------------------------------------------------------------*/
    function drawAxes() {
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
            .text("Year");

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -margin.top)
            .attr("y", 5)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .attr("class", "label")
            .text("U5MR");
    }
    /*======================================================================
    ======================================================================*/

    nestData();
    setScalesDomain();
    drawAxes();
    drawLines();

} // end of data