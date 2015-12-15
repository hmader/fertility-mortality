var margin = {
        top: 10,
        right: 10,
        bottom: 30,
        left: 30
    },
    width = 600 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var worldMap;
var mixedDataset;
var fertilityDataset;
var mortalityDataset;
var worldMortalityDataset;

var countryById = d3.map();
var mapColorScale;

var svg;

var dateFormat = d3.time.format("%Y");


var myTooltip = d3.select("body")
    .append("div")
    .attr("class", "myTooltip");

var disableTooltip = false;

var slideText = [{
        "slide": 0,
        "title": "Global Child Mortality",
        "text": "<p>Globally and regionally, Under-5 Mortality (U5MR) is decreasing. However, globally, we are still far from reaching the Millennium Development Goals (MDG) in child mortality, with some countries faring far worse than others.</p><p class='note'>This map is shaded to reflect the U5MR in each country. The most recent data for this chart is 2015.</p>"
                },
    {
        "slide": 1,
        "title": "Millenium Development Goals",
        "text": "<p>The Millenium Development Goal (MDG) target for Under-5 Mortality is as follows: <strong>“reduce child mortality globally by two-thirds, from 87 children of every 1,000 dying before age 5 in 1990 to 29 of every 1,000 in 2015”</strong> (UNICEF). According to the most recent UNICEF report, the global Under-5 Mortality rate stands just below 43, and not yet reached the goal for 2015. </p><p class='note'>Roll over the line chart below to see the world Under-5 Mortality rate and how the map looked for that year.</p>"
                },
    {
        "slide": 2,
        "title": "Fertility Stands Out",
        "text": "<p>When comparing the relationships between various societal and economic factors to Under-5 Mortality rates, the tightest linear relationship shows to be with Fertility rates.</p>"
                },
    {
        "slide": 3,
        "title": "Fertility Stands Out",
        "text": "<p>When comparing the relationships between various societal and economic factors to Under-5 Mortality rates, the tightest linear relationship shows to be with Fertility rates.</p>"
                },
    {
        "slide": 4,
        "title": "Fertility Stands Out",
        "text": "<p>When comparing the relationships between various societal and economic factors to Under-5 Mortality rates, the tightest linear relationship shows to be with Fertility rates.</p>"
                },
    {
        "slide": 5,
        "title": "Fertility & Mortality Over Time",
        "text": "<p>The relationship between Fertility rates and Under-5 Mortality rates have shown to hold up over time. This chart shows this relationship from 1970 to 2013.</p>"
                }
];