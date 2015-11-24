// Settings object

// For use with scroller_template.html and mfreeman_scroller.js.


// function to move a selection to the front/top, from
// https://gist.github.com/trtg/3922684
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};

var measure = "U5MR";
var mapThis = [measure];

var settings = {
    // could be used to save settings for styling things.
}

/*--------------------------------------------------------------------------
    focus_country - from switch
  --------------------------------------------------------------------------*/

function focus_country(focusing_on) {
    console.log("in focus", focusing_on);
    // unfocus all, then focus one if given a name.
    d3.selectAll("path").classed("focused", false);
    var toFocus = d3.selectAll("g.countries>path." + focusing_on);
    toFocus.classed("focused", true);
    console.log("focusing_on", focusing_on, toFocus);
}

/*--------------------------------------------------------------------------
    Scroll Update Switch
  --------------------------------------------------------------------------*/

// ******* Change the showX and showY function for some cases ********
var update = function (value) {

        switch (value) {
        case 0:

            console.log("in case", value);
        case 1:
            console.log("in case", value);
//            countries = null;
//            measure = "U5MR";
        case 2:
            console.log("in case", value);
                
            changeColorMeasure("U5MR");
            break;
        case 3:
            console.log("in case 3");
                
            changeColorMeasure("FertilityRate");
            focus_country(null);
            break;
        case 4:
            console.log("in case ", value);
                
            focus_country("topFertility");
            changeColorMeasure("FertilityRate");
            break;
       
        default:
            countries = null;
            focus_country(countries);
            break;
        }
        //        focus_country(countries); // this applies a highlight on a country.
        //        console.log("MEASURE", measure);
//        changeColorMeasure(measure);
    }
    // setup scroll functionality

//var data = []; // make this global
//
//function loaded(error, world, mydata) {
//    if (error) {
//        console.log(error);
//    } else {
//        console.log(data);
//        data = mydata; // assign to global
//        console.log(data);
//        drawMap(data, world);
//        draw(measure);
//
//
//        console.log("world", world);
//        console.log("data", data);
//
//        var scroll = scroller()
//            .container(d3.select('#graphic'));
//
//        // pass in .step selection as the steps
//        scroll(d3.selectAll('.step'));
//
//        // Pass the update function to the scroll object
//        scroll.update(update)
//    }
//}
//
//
///*--------------------------------------------------------------------------
//    Queue load files
//  --------------------------------------------------------------------------*/
//
//
//queue()
//    .defer(d3.json, "data/topojson/world/countries.json")
//    .defer(d3.csv, "data/MultipleMapData.csv", typeAndSet) // process
//    .await(loaded);
//
///*--------------------------------------------------------------------------
//    Fix Data Type
// --------------------------------------------------------------------------*/
//
//function typeAndSet(d) {
//
//    d.PercentBelowPovertyLine = +d.PercentBelowPovertyLine;
//    d.IMR = +d.IMR;
//    d.U5MR = +d.U5MR;
//    d.FertilityRate = +d.FertilityRate;
//
//    countryById.set(d.CountryCode, d);
//    //    console.log("countryById", countryById);    
//    //    console.log("d", d);
//    return d;
//}