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

var countryById = d3.map();

var svg;

var dateFormat = d3.time.format("%Y");

var slideText = [{
        "slide": 0,
        "title": "Global Child Mortality",
        "text": "<p>Globally and regionally, under-5 mortality is decreasing. However, globally we are still far from reaching the Millennium Development Goals (MDG) in child mortality.</p>"
                },
    {
        "slide": 1,
        "title": "Global Child Mortality",
        "text": "<p>Globally and regionally, under-5 mortality is decreasing. However, globally we are still far from reaching the Millennium Development Goals (MDG) in child mortality.</p><p>The MDG target for under-5 mortality is as follows: <strong>“reduce child mortality globally by two-thirds, from 87 children of every 1,000 dying before age 5 in 1990 to 29 of every 1,000 in 2015”</strong> (UNICEF). According to the most recent UNICEF report, the global under-5 mortality rate stands at 43, above the goal for 2015. </p>"
                },
    {
        "slide": 2,
        "title": "",
        "text": "<p></p>"
                },
    {
        "slide": 3,
        "title": "Fertility - Mortality Over Time",
        "text": "<p>Fertility rates and under-5 mortality rates have shown to have a strong relationship over time. This chart shows this relationship since 1970.</p>"
                }
];