var stepCount = 0;
var maxSteps = 5;

var myTooltip = d3.select("body")
    .append("div")
    .attr("class", "myTooltip");
var disableTooltip = false;

/*======================================================================
 Slide Counter Increment/ Decrement, slide swap
======================================================================*/
function prevSlide() {
    if (stepCount > 0) {
        stepCount--;
        console.log("Step: ", stepCount);
    }

    callStep();
}

function nextSlide() {
    if (stepCount < maxSteps) {
        stepCount++;
        console.log("Step: ", stepCount);
    }

    callStep();
}

function removeSVG() {
    if (svg) {
        d3.selectAll("svg").remove();
    }
}

function changeText() {
    if (slideText[stepCount]) {
        $("#slideHeader").html(slideText[stepCount].title);
        $("#slideText").html(slideText[stepCount].text);
    }
}

/*======================================================================
 callStep()
======================================================================*/
function callStep() {
    switch (stepCount) {
    case 0:
        /* Heat Map */
        $("#text-wrap>button.go.previous").addClass("nonClick");
        console.log("Case ", stepCount);
        disableTooltip = false;
        changeText();
        removeSVG();
        heatMap(countryById);
        break;
    case 1:
        /* Heat Map, Animated Line */
        console.log("Case ", stepCount);
        disableTooltip = true;
        changeText();
        removeSVG();

        animatedLine();
        heatMap(countryById);
        break;

    case 2:
        /* Small Multiples */
        console.log("Case ", stepCount);
        changeText();
        removeSVG();

        drawMultiples();
        break;
    case 3:
        /* Small Multiples */
        console.log("Case ", stepCount);
        changeText();
        removeSVG();
        drawMultiples();
        break;
    case 4:
        /* Small Multiples */
        console.log("Case ", stepCount);
        changeText();
        removeSVG();

        drawMultiples();
        break;
    case 5:
        /* Scatter Chart */
        console.log("Case ", stepCount);
        changeText();
        removeSVG();

        drawFMOverTime();
        break;
    case 6:
        console.log("Case ", stepCount);
        break;
    default:
        console.log("Default Break");
        break;
    }
}

/*======================================================================
 loaded()
======================================================================*/
function loaded(error, world, fertilityData, mortalityData, multipleMapData, worldLine) {
    console.log("COUNTRY BY ID 1", countryById);

    worldMap = world;
    fertilityDataset = fertilityData;
    mixedDataset = multipleMapData;
    mortalityDataset = mortalityData;
    worldMortalityDataset = worldLine;
    heatMap(countryById);
    changeText();
}
/*======================================================================
 queue Data
======================================================================*/
queue()
    .defer(d3.json, "data/world/countries.json")
    .defer(d3.csv, "data/fertilityOverTime.csv") // process
    .defer(d3.csv, "data/median-U5MRbyCountry.csv", setCountryById)
    .defer(d3.csv, "data/MultipleMapData.csv", typeAndSet)
    .defer(d3.csv, "data/world-U5MR-overTime.csv")
    .await(loaded);

function typeAndSet(d) {

    d.Percent_Below_Poverty_Line = +d.Percent_Below_Poverty_Line;
    d.IMR = +d.IMR;
    d.Communicable_Diseases = +d.Communicable_Diseases;
    d.Health_Expenditure_Per_Capita = +d.Health_Expenditure_Per_Capita;
    d.Fertility_Rate = +d.Fertility_Rate;
    d.Contraceptive_Prevalence = +d.Contraceptive_Prevalence;
    d.Secondary_Edu_Attendance = +d.Secondary_Edu_Attendance;

    return d;
}

function setCountryById(d) {
    countryById.set(d.CountryCode, d);
    return d;
}