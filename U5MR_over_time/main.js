/*======================================================================
   Setup
 ======================================================================*/

var margin = {
    top: 50,
    right: 10,
    bottom: 70,
    left: 70
};

var width = $(window).width() * .9;
var height = $(window).height() * .85;

var MDG = 29;

var subSaharanAfrica = ["Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Cabo Verde", "Central African Republic", "Chad", "Comoros", "Congo", "Cote d'Ivoire", "Democratic Republic of the Congo", "Djibouti", "Equatorial Guinea", "Eritrea", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "Sudan", "Swaziland", "United Republic of Tanzania", "Togo", "Uganda", "Zambia", "Zimbabwe"];

//Set up date formatting and years
var dateFormat = d3.time.format("%Y");

//Set up scales
var xScale = d3.time.scale()
    .range([margin.left, width - margin.right - margin.left]);

var yScale = d3.scale.sqrt()
    .range([margin.top, height - margin.bottom]);

//Configure axis generators
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(15)
    .tickFormat(function (d) {
        return dateFormat(d);
    })
    .innerTickSize([0]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .innerTickSize([0]);

// add a tooltip to the page - not to the svg itself!
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

//Configure line generator
// each line dataset must have a d.year and a d.rate for this to work.
var line = d3.svg.line()
    .x(function (d) {
        return xScale(dateFormat.parse(d.year));
    })
    .y(function (d) {
        return yScale(+d.rate);
    });



//Create the empty SVG image
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


/*======================================================================
   Creating the Multiple Lines from the Data
 ======================================================================*/

//Load data - first is INFANT mortality rates, second is UNDER 5 mortality rates. Similar, but many more peaks in the Under 5.
//d3.csv("median-IMRbyCountry.csv", function (data) {
d3.csv("median-U5MRbyCountry.csv", function (data) {

    //Data is loaded in, but we need to restructure it.
    //Remember, each line requires an array of x/y pairs;
    //that is, an array of arrays, like so:
    //
    //	[ [x: 1, y: 1], [x: 2, y: 2], [x: 3, y: 3] ]
    //
    //We, however, are using 'year' as x and 'amount' as y.
    //We also need to know which country belongs to each
    //line, so we will build an array of objects that is
    //structured like this:
    /*

    	[
    		{
    			country: "Australia",
    			emissions: [
    						{ year: 1961, amount: 90589.568 },
    						{ year: 1962, amount: 94912.961 },
    						{ year: 1963, amount: 101029.517 },
    						…
    					   ]
    		},
    		{
    			country: "Bermuda",
    			emissions: [
    						{ year: 1961, amount: 176.016 },
    						{ year: 1962, amount: 157.681 },
    						{ year: 1963, amount: 150.347 },
    						…
    					   ]
    		},
    		…
    	 ]

    */
    //Note that this is an array of objects. Each object
    //contains two values, 'country' and 'emissions'.
    //The 'emissions' value is itself an array, containing
    //more objects, each one holding 'year' and 'amount' values.

    //New array with all the years, for referencing later
    //var years = ["1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010"];

    // or you could get this by doing:

    var years = d3.keys(data[0]).slice(1, 65); //
    console.log(years);

    //Create a new, empty array to hold our restructured dataset
    var dataset = [];

    //Loop once for each row in data
    data.forEach(function (d, i) {

        var IMRs = [];

        years.forEach(function (y) { //Loop through all the years - and get the rates for this data element


            if (d[y]) { /// What we are checking is if the "y" value - the year string from our array, which would translate to a column in our csv file - is empty or not.

                IMRs.push({ //Add a new object to the new rates data array - for year, rate. These are OBJECTS that we are pushing onto the array
                    year: y,
                    rate: d[y], // this is the value for, for example, d["2004"]
                    Country: d.Country
                });
            }

        });

        dataset.push({ // At this point we are accessing one index of data from our original csv "data", above and we have created an array of year and rate data from this index. We then create a new object with the Country value from this index and the array that we have made from this index.
            country: d.Country,
            rates: IMRs // we just built this from the current index.
        });

    });

    //Uncomment to log the original data to the console
    console.log(data);

    //Uncomment to log the newly restructured dataset to the console
    console.log(dataset);


    //Set scale domains - max and min of the years
    xScale.domain(
        d3.extent(years, function (d) {
            return dateFormat.parse(d);
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


    //Make a group for each country
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
        .classed("ssAfrica", function (d, i) {
            console.log(d[i].Country);
            if ($.inArray(d[i].Country, subSaharanAfrica) != -1) {
                console.log("true");
                return true;
            } else {
                console.log("false");
                return false;
            }
        })
        .attr("d", line);


    /*======================================================================
      Adding the Axes
    ======================================================================*/
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxis)
        .append("text")
        .attr("x", width - margin.left - margin.right)
        .attr("y", margin.bottom / 3)
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
        .attr("y", -2*margin.left / 3)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .attr("class", "label")
        .text("Under 5 Mortality Rate");

    /*======================================================================
      MDG line
    ======================================================================*/

    svg.append("line")
        .attr("class", "MDG")
        .attr("x1", margin.left)
        .attr("y1", yScale(MDG))
        .attr("x2", width - margin.left - margin.right + 15)
        .attr("y2", yScale(MDG));

    svg.append("text")
        .attr("class", "aside")
        .attr("x", width - margin.left - margin.right + 20)
        .attr("y", yScale(MDG) - 6)
        .attr("dy", "1em")
        .style("text-anchor", "start")
        .text("Global MDG");

    /*======================================================================
      Mouse Functions
    ======================================================================*/
    d3.selectAll("g.lines")
        .on("mouseover", mouseoverFunc)
        .on("mouseout", mouseoutFunc)
        .on("mousemove", mousemoveFunc);

    function mouseoutFunc() {

        d3.selectAll("path.line").classed("unfocused", false).classed("focused", false);
        tooltip.style("display", "none"); // this sets it to invisible!
    }

    function mouseoverFunc(d) {

        d3.selectAll("path.line").classed("unfocused", true);
        // below code sets the sub saharan africa countries out even more - they only go "unfocused" if a sub saharan country is selected. Otherwise, they remain at the regular opacity. I experiemented with this because I do want to focus on the ssAfrica countries rather than any others (so they are only "unfocused" against each other, not to other countries... This way all other countries are always compared to the ssAfrica ones... but not sure if this method is effective).
        //         if(!d3.select(this).select("path.line").classed("ssAfrica")) {
        //             d3.selectAll("path.ssAfrica").classed("unfocused", false);
        //         }

        d3.select(this).select("path.line").classed("unfocused", false).classed("focused", true);
        tooltip
            .style("display", null) // this removes the display none setting from it
            .html("<p><span class='tooltipHeader sans'>" + d.country + "</span></p>");
    }

    function mousemoveFunc(d) {
        console.log("events", window.event, d3.event);
        tooltip
            .style("top", (d3.event.pageY - 45) + "px")
            .style("left", (d3.event.pageX + 5) + "px");
    }



}); // end of data csv