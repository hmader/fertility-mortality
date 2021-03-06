var stepCount = 0;
var maxSteps = 5;

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
        $("#text-wrap>button.go.previous").prop("disabled", true);
        console.log("Case ", stepCount);
        disableTooltip = false;
        changeText();
        removeSVG();
        heatMap(countryById);
        break;
    case 1:
        /* Heat Map, Animated Line */
        $("#text-wrap>button.go.previous").removeClass("nonClick");
        $("#text-wrap>button.go.previous").prop("disabled", false);
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
        d3.selectAll("circle.dots").attr("opacity", .2);
        d3.select("g.Fertility_Rate").selectAll("circle.dots").attr("opacity", .6);
        d3.selectAll("line.trendline").attr("opacity", 1);
        d3.selectAll(".rvalue").attr("opacity", 1);
        break;
    case 4:
        /* Scatter Chart */
        $("div.end-slide").addClass("hide");
        $("#vis-sub").removeClass("hide");
        $("#vis-wrap").removeClass("hide");
        $("#text-wrap").removeClass("hide");


        console.log("Case ", stepCount);
        changeText();
        removeSVG();

        drawFMOverTime();
        break;
    case 5:
        console.log("Case ", stepCount);
        $("div.end-slide").removeClass("hide");
        $("#vis-sub").addClass("hide");
        $("#vis-wrap").addClass("hide");
        $("#text-wrap").addClass("hide");
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

    $("#text-wrap>button.go.previous").addClass("nonClick");
    $("#text-wrap>button.go.previous").prop("disabled", true);

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