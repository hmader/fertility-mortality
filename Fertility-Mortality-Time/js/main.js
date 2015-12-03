var stepCount = 0;
var maxSteps = 5;

var myTooltip = d3.select("body")
    .append("div")
    .attr("class", "myTooltip");

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

/*======================================================================
 callStep()
======================================================================*/
function callStep() {
    switch (stepCount) {
    case 0:
        if (svg) {
            svg.remove();
        }
        drawLines(mortalityDataset);
        console.log("Case ", stepCount);
        break;
    case 1:
        if (svg) {
            svg.remove();
        }
        drawFMOverTime();
        console.log("Case ", stepCount);
        break;
    case 2:
        if (svg) {
            svg.remove();
        }
        console.log("Case ", stepCount);
        break;
    case 3:
        console.log("Case ", stepCount);
        break;
    case 4:
        console.log("Case ", stepCount);
        break;
    case 5:
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
function loaded(error, fertilityData, mortalityData) {

    fertilityDataset = fertilityData;
    mortalityDataset = mortalityData;
    drawLines(mortalityDataset);


}
/*======================================================================
 queue Data
======================================================================*/
queue()
    .defer(d3.csv, "data/fertilityOverTime.csv") // process
    .defer(d3.csv, "data/median-U5MRbyCountry.csv")
    .await(loaded);