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

    var mapTooltip = d3.select("body")
        .append("div")
        .attr("class", "mapTooltip");

    mapTooltip.append("p")
        .attr("class", "tooltipHeader");

    mapTooltip.append("div")
        .attr("class", "chart");

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

        var countryGroup = g.append("g")
            .attr("class", "countries");

        countryShapes = countryGroup
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
            .attr("stroke", "#fff")
            .attr("class", "countryShape");

        if (!disableTooltip) {
            d3.selectAll(".countryShape").classed("hoverable", true);
        }
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
                var mortality2015 = countryById.get(d.id)["yr2015"];
                if (!isNaN(mortality2015)) {
                    // set the tooltip title
                    toolstring = countryById.get(d.id)["Country"];
                    // now the chart
                    drawTooltipChart(mortality2015);
                } else {
                    toolstring = "No Data";
                }
            } else {
                toolstring = "No Data";
            }

            mapTooltip
                .style("opacity", 1)
                .style("display", null);

            mapTooltip.select("p")
                .html(toolstring);
            //    console.log("moused over", toolstring);
        }
    }

    function mousemoveFunc(d) {
        mapTooltip
            .style("top", (d3.event.pageY - 5) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
    }

    function mouseoutFunc(d) {
        d3.select("svg.tooltipChart").remove();
        return mapTooltip.style("display", "none"); // this sets it to invisible!
    }

    function drawTooltipChart(mortval) {

        var m_margin = {
                top: 20,
                right: 27,
                bottom: 10,
                left: 10
            },
            m_width = 200 - m_margin.left - m_margin.right,
            m_height = 60 - m_margin.top - m_margin.bottom;

        var xScale = d3.scale.linear().domain([0, 156.9]).range([m_margin.left, m_width]);

        var svg = mapTooltip.select("div.chart")
            .append("svg")
            .attr("class", "tooltipChart");
        /* Country Specific */
        
        svg.append("rect")
            .attr("y", m_margin.top - 5)
            .attr("x", m_margin.left)
            .attr("height", 10)
            .attr("width", function () {
                return xScale(mortval) - m_margin.left;
            })
            .attr("fill", "#000")
            .attr("opacity", .5);

        svg.append("line")
            .attr("x1", function () {
                return (xScale(mortval));
            })
            .attr("y1", m_margin.top - 7)
            .attr("y2", m_margin.top + 7)
            .attr("x2", function () {
                return (xScale(mortval));
            })
            .attr("stroke", "#000")
            .attr("stroke-width", 1);

        svg.append("text")
            .attr("x", function () {
                return xScale(mortval);
            })
            .attr("y", m_margin.top - 10)
            .attr("class", "label")
            .text(mortval)
        .attr("fill", "#E60000");

        /* World Line */
        svg.append("line")
            .attr("x1", function () {
                return (xScale(42.5));
            })
            .attr("y1", m_margin.top - 7)
            .attr("y2", m_margin.top + 14)
            .attr("x2", function () {
                return (xScale(42.5));
            })
            .attr("stroke", "#000")
            .attr("stroke-width", 1);

        svg.append("text")
            .attr("x", function () {
                return (xScale(42.5));
            })
            .attr("y", m_margin.top + 25)
            .attr("class", "label")
            .style("text-anchor", "middle")
            .text("World");
        
        svg.append("text")
            .attr("x", function () {
                return (xScale(42.5));
            })
            .attr("y", m_margin.top + 37)
        .style("text-anchor", "middle")
            .attr("class", "label")
            .text("(42.5)");
        
        /* ********** */
        svg.append("line")
            .attr("y1", m_margin.top)
            .attr("x1", m_margin.left)
            .attr("y2", m_margin.top)
            .attr("x2", m_width)
            .attr("stroke", "#000")
            .attr("stroke-width", 1);

        svg.append("text")
            .attr("x", 0)
            .attr("y", m_margin.top + 3)
            .attr("class", "label")
            .text("0");

        svg.append("text")
            .attr("x", m_width + 5)
            .attr("y", m_margin.top + 3)
            .attr("class", "label")
            .text("Highest");

        svg.append("text")
            .attr("x", m_width + 6)
            .attr("y", m_margin.top + 15)
            .attr("class", "label")
            .text("(156.9)");
    }

    /**/

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