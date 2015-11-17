//Load in contents of CSV file, and do things to the data.

d3.csv("contraceptive-mortality-select-countries-chart.csv", function (error, myData) {

    if (error) {
        console.log("Had an error loading file.");
    }
    /*
        myData.sort(function (a, b) { // sort data before using
            return b.Average - a.Average; // by Average value
        });
    */
    // We'll be using simpler data as values, not objects.
    var myArray = [];

    var noEduVals = []; //-- just in case 
    var primaryEduVals = []; //-- just in case 
    var secondaryEduVals = []; //-- just in case 
    var avgVals = []; //-- just in case 
    var allVals = []; //-- use for scale
    var mortalityVals = []; //-- use for scale

    myData.forEach(function (d, i) {

        d.Average = +d3.format(".2f")(d.Average);
        d.None = +d.None;
        d.Primary = +d.Primary;
        d["Secondary or Higher"] = +d["Secondary or Higher"];
        d.U5MR = +d.U5MR;
        // Add a new array with the values of each:
        myArray.push([d.Country, d.None, d.Primary, d["Secondary or higher"], d.Average, d.U5MR]);
        
        noEduVals.push(d.None);
        console.log("No edu: " + d.None);
        primaryEduVals.push(d.Primary);
        secondaryEduVals.push(d["Secondary or higher"]);
        avgVals.push(d.Average);
        
        mortalityVals.push(d.U5MR);
        
        allVals.push(d.Average);
        allVals.push(d.None);
        allVals.push(d.Primary);
        allVals.push(d["Secondary or higher"]);
    });
    
    console.log(noEduVals);

    console.log(myData);
    console.log(myArray);

    // You could also have made the new array with a map function!

    var table = d3.select("#table").append("table");

    var header = table.append("thead").append("tr");

    //--- need to create objects with sort type data for stupidtable
    var headerObjs = [
        {
            label: "Country",
            sort_type: "string"
        },
        {
            label: "No Edu.",
            sort_type: "int"
        },
        {
            label: "Primary Edu.",
            sort_type: "int"
        },
        {
            label: "Secondary Edu.",
            sort_type: "int"
        },
        {
            label: "Averaged Edu.",
            sort_type: "int"
        },
        {
            label: "U5MR",
            sort_type: "int"
        },
				];

    //--- passing data object with table header labels and sort_type below
    header
        .selectAll("th")
        .data(headerObjs)
        .enter()
        .append("th")
        .attr("data-sort", function (d) {
            return d.sort_type;
        })
        .text(function (d) {
            return d.label;
        });

    var tablebody = table.append("tbody");

    rows = tablebody
        .selectAll("tr")
        .data(myArray)
        .enter()
        .append("tr");

    // We built the rows using the nested array - now each row has its own array.
    // let's talk about the scale - start at 0 or at lowest number?
    console.log('No edu. extent is ', d3.extent(noEduVals));
    console.log('Primary edu. extent is ', d3.extent(primaryEduVals));
    console.log('Secondary edu. extent is ', d3.extent(secondaryEduVals));
    console.log('Average edu. extent is ', d3.extent(avgVals));
    console.log('Total edu. extent is ', d3.extent(allVals));

    var colorScaleBlue = d3.scale.linear()
        .domain(d3.extent(allVals))
        .range(["#E6F5FF", "#0099FF"]);
    
    var colorScaleRed = d3.scale.linear()
        .domain(d3.extent(mortalityVals))
        .range(["#FFE6E6", "#FF0000"]);
    
console.log("mortalityVals: " + mortalityVals);
console.log(d3.extent(mortalityVals));
    

    cells = rows.selectAll("td")
        // each row has data associated; we get it and enter it for the cells.
        .data(function (d) {
            return d;
        })
        .enter()
        .append("td")
        .style("background-color", function (d, i) {
            // color the background for each value column corresponding to appropriate scale:
            if ((i === 1) || (i === 2) || (i === 3) || (i === 4)) {
                return colorScaleBlue(d);
            }
           
            if (i === 5) {
                return colorScaleRed(d);
            }
        })
        .text(function (d) {
            return d;
        });
    
    /*--- See difference from above & below: to add the color scale, must append the style element with a function of the color scale.
    
    cells = rows.selectAll("td")
        // each row has data associated; we get it and enter it for the cells.
        .data(function (d) {
            console.log(d);
            return d;
        })
        .enter()
        .append("td")
        .text(function (d) {
            return d;
        });
        */

    //--- Using stupidtable below to make sortable

    $("table").stupidtable();
});