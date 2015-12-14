var measure = "yr2015";

var countryShapes;
/*======================================================================
    map color & legend
======================================================================*/

function getColor(d) {
    //    console.log("getColor d", d);
    var dataRow = countryById.get(d.id);
    //            console.log("dataRow", dataRow);
    //                console.log("d.id", d.id);
    //        console.log("d", d);
    if (dataRow) {
        //            console.log("dataRow[measure]", dataRow[measure]);
        if (isNaN(dataRow[measure])) {
            return "#EBEBEB";
        } else {
            if (d === "USA") {
                console.log("color", mapColorScale(dataRow[measure]));
            }
            return mapColorScale(dataRow[measure]);
        }
    } else {
        //        console.log("no dataRow", d);
        return "#EBEBEB";
    }
}

function drawLegend() {

    var linear = mapColorScale;

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

/*======================================================================
    Draw Heatmap
======================================================================*/
function heatMap(countrybyid) {

    console.log("MIXED DATA", mortalityDataset);
    console.log("MAP", worldMap);

    var margin = {
            top: 10,
            right: 10,
            bottom: 30,
            left: 30
        },
        width = 600 - margin.right - margin.left,
        height = 400 - margin.top - margin.bottom;

    //    var mapColorScale = d3.scale.linear().range(["#fff2e5", "#cc0000"]).interpolate(d3.interpolateLab);

    mapColorScale = d3.scale.linear().range(["#99e6ff", "#FF0000"]).interpolate(d3.interpolateLab);

    var world_map_data = mortalityDataset;
    var world_map = worldMap;

    var countryById = countrybyid;


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
            .translate([width / 2, 2 * height / 3]);

        var path = d3.geo.path()
            .projection(projection);

        //        mapColorScale.domain([2, 162.2]);
        mapColorScale.domain([1, 330]);

        var countries = topojson.feature(world_map, world_map.objects.units).features;
        //        console.log("country by id", countryById);

        countryShapes = g.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(countries)
            .enter()
            .append("path")
            //        .attr('class', 'countries')
            .attr("id", function (d) {
                if (countryById.get(d.id)) {
                    return countryById.get(d.id).Country.replace(/\s/g, '_');;
                } else {
                    return "NoMatchingCountryID";
                }
            })
            .attr('d', function (d) {
                if (d.id !== "ATA") {
                    return path(d);
                }
            })
            .on("mouseover", mouseoverFunc)
            .on("mouseout", mouseoutFunc)
            .on("mousemove", mousemoveFunc)
            .attr('fill', function (d, i) {
                return getColor(d);
            })
            .attr("stroke", "#fff");
    }


    /*--------------------------------------------------------------------------
         Mouse Events
     --------------------------------------------------------------------------*/

    function mouseoverFunc(d) {
        if (!disableTooltip) {
            //    console.log("THIS", this);
            var toolstring = null;

            $(this).addClass("hovered");
            //    console.log("THIS after", this);

            if (countryById.get(d.id)) {

                if (!isNaN(countryById.get(d.id)["yr2015"])) {
                    toolstring = "<p><span class='tooltipHeader'>" + countryById.get(d.id)["Country"] + "</span><br>Child mortality: " + countryById.get(d.id)["yr2015"] + "</p>";
                } else {
                    toolstring = "No Data";
                }
            } else {
                toolstring = "No Data";
            }

            myTooltip
                .style("opacity", 1)
                .style("display", null)
                .html(toolstring);
            //    console.log("moused over", toolstring);
        }
    }

    function mousemoveFunc(d) {
        myTooltip
            .style("top", (d3.event.pageY - 5) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
    }

    function mouseoutFunc(d) {
        return myTooltip.style("display", "none"); // this sets it to invisible!
    }

    draw();
}

/*======================================================================
    Change Map Color Scale
======================================================================*/
function changeColorMeasure(year) {
    countryShapes.attr('fill', function (d, i) {
        return getColor(d);
    });
}