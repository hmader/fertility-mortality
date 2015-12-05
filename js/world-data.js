function heatMap(countrybyid) {

    console.log("MIXED DATA", mixedDataset);
    console.log("MAP", worldMap);

    var measure = "U5MR2014";
    var countryById = countrybyid;

//    var colorScale = d3.scale.linear().range(["#2185C5", "#990000"]).interpolate(d3.interpolateLab);
//    var colorScale = d3.scale.linear().range(["#ebebfa", "#990000"]).interpolate(d3.interpolateLab);
    var colorScale = d3.scale.linear().range(["#fff2e5", "#cc0000"]).interpolate(d3.interpolateLab);

    var myTooltip = d3.select("body")
        .append("div")
        .attr("class", "myTooltip");

    var world_map_data = mixedDataset;
    var world_map = worldMap;

    var countryShapes;

    var topFertility = 4.57;

    /*--------------------------------------------------------------------------
        Get Colors and Text to draw
     --------------------------------------------------------------------------*/

    function getColor(d) {
        //    console.log("getColor d", d);
        var dataRow = countryById.get(d.id);
//        console.log("dataRow", dataRow);
        //            console.log("d.id", d.id);
        //    console.log("d", d);
        if (dataRow) {
            //            console.log("dataRow[measure]", dataRow[measure]);
            if (isNaN(dataRow[measure])) {
                return "#EBEBEB";
            } else {
                return colorScale(dataRow[measure]);
            }
        } else {
            //        console.log("no dataRow", d);
            return "#EBEBEB";
        }
    }

    function getText(d) {
        var dataRow = countryById.get(d.id);
        if (dataRow) {
            //        console.log("dataRow", dataRow);
            return dataRow.Country + ":" + dataRow[measure];
        } else {
            //        console.log("no dataRow", d);
            return d.properties.name + ": No data.";
        }
    }

    function drawLegend() {

        var linear = colorScale;

        svg.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(20, 400)");

        var legendLinear = d3.legend.color()
            .shapeWidth(30)
            .orient('horizontal')
            .scale(linear);

        svg.select(".legendLinear")
            .call(legendLinear);
    }
    /*--------------------------------------------------------------------------
        Actually Drawing the Map
     --------------------------------------------------------------------------*/
    function draw() {

        svg = d3.select('#vis').append('svg')
            .attr('width', width)
            .attr('height', height);

        var g = svg.append("g");

        var projection = d3.geo.mercator()
            .scale(100) // mess with this if you want
            .translate([width / 2, height / 2]);

        var path = d3.geo.path()
            .projection(projection);

        colorScale.domain([2, 162.2]);

        var countries = topojson.feature(world_map, world_map.objects.units).features;
//        console.log("country by id", countryById);

        countryShapes = g.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(countries)
            .enter()
            .append("path")
            //        .attr('class', 'countries')
            .attr("class", function (d) {
                if (countryById.get(d.id)) {
                    if (countryById.get(d.id)["FertilityRate"] >= topFertility) {
                        //                    console.log("FERTLITY", countryById.get(d.id), countryById.get(d.id)["FertilityRate"]);
                        return "topFertility";
                    }
                }
            })
            .attr("id", function (d) {
                if (countryById.get(d.id)) {
                    return countryById.get(d.id).Country.replace(/\s/g, '_');;
                } else {
                    return "NoMatchingCountryID";
                }
            })
            .attr('d', path)
            .on("mouseover", mouseoverFunc)
            .on("mouseout", mouseoutFunc)
            .on("mousemove", mousemoveFunc)
            .attr('fill', function (d, i) {
                return getColor(d);
            })
            .attr("stroke", "#fff");

        /*--------------------------------------------------------------------------
            Legend
         --------------------------------------------------------------------------*/
        //drawLegend();
        //
        //    var linear = colorScale;
        //
        //    svg.append("g")
        //        .attr("class", "legendLinear")
        //        .attr("transform", "translate(20, 400)");
        //
        //    var legendLinear = d3.legend.color()
        //        .shapeWidth(30)
        //        .orient('horizontal')
        //        .scale(linear);
        //
        //    svg.select(".legendLinear")
        //        .call(legendLinear);
    }


    /*======================================================================
         Mouse Events
       ======================================================================*/

    function mouseoverFunc(d) {
        //    console.log("THIS", this);
        var toolstring = null;

        $(this).addClass("hovered");
        //    console.log("THIS after", this);

        if (countryById.get(d.id)) {
            toolstring = "<p><span class='tooltipHeader'>" + countryById.get(d.id)["Country"] + "</span><br>Fertility rate: " + countryById.get(d.id)["FertilityRate"] + "<br>Child mortality: " + countryById.get(d.id)["U5MR2014"] + "</p>";
        } else {
            toolstring = "No Data";
        }

        myTooltip
            .style("opacity", 1)
            .style("display", null)
            .html(toolstring);
        //    console.log("moused over", toolstring);
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
    draw();
}