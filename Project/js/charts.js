
var width = 700;
var height = 600;
var margin = {
    top: 20,
    right: 0,
    bottom: 40,
    left: 50
};

var color = "#0099FF";


// function to move a selection to the front/top, from
// https://gist.github.com/trtg/3922684
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};


var settings = {
    // could be used to save settings for styling things.
}


var dataset1 = []; // make this global
var dataset2 = []; // make this global
var dataset3 = []; // make this global

function loaded(error, world, worldData) {
    if (error) {
        console.log(error);
    } else {

        /*  Drawing the first set of charts (map with scroll)  */
        dataset1 = worldData; // assign to global
//        drawMap(dataset1, world);
        draw(dataset1, world, measure);
         var scroll = scroller()
            .container(d3.select('#graphic'));

        // pass in .step selection as the steps
        scroll(d3.selectAll('.step'));

        // Pass the update function to the scroll object
        scroll.update(update)

    }
}


/*--------------------------------------------------------------------------
    Queue load files
  --------------------------------------------------------------------------*/


queue()
    .defer(d3.json, "data/topojson/world/countries.json")
    .defer(d3.csv, "data/MultipleMapData.csv", typeAndSet) // process
//    .defer(d3.csv, "data/Contraceptive-Types-select-countries-2013-2014.csv", typefix)
//    .defer(d3.csv, "data/fertilityOverTime.csv")
    .await(loaded);

/*--------------------------------------------------------------------------
    Fix Data Type
 --------------------------------------------------------------------------*/

function typeAndSet(d) {

    d.PercentBelowPovertyLine = +d.PercentBelowPovertyLine;
    d.IMR = +d.IMR;
    d.FertilityRate = +d.FertilityRate;

    countryById.set(d.CountryCode, d);

    return d;
}

function typefix(d) {
      d["Any Method"] = +d["Any Method"];
      d["Any Modern"] = +d["Any Modern"];
      d["Female Sterilization"] = +d["Female Sterilization"];
      d["Male Sterilization"] = +d["Male Sterilization"];
      d["Pill"] = +d["Pill"];
      d["Injectable"] = +d["Injetable"];
      d["IUD"] = +d["IUD"];
      d["Male Condom"] = +d["Male Condom"];
      d["Vaginal barrier methods"] = +d["Vaginal barrier methods"];
      d["Implant"] = +d["Implant"];
      d["Other modern methods"] = +d["Other modern methods"];
      d["Any traditional method"] = +d["Any traditional method"];
      d["Rhythm"] = +d["Rhythm"];
      d["Withdrawl"] = +d["Withdrawl"];
      d["Other traditional methods"] = +d["Other traditional methods"];
      d["FertilityRate"] = +d["FertilityRate"];
  return d;
}