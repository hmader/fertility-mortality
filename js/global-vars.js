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

var mapTooltip = d3.select("body")
    .append("div")
    .attr("class", "mapTooltip");

var disableTooltip = false;

var slideText = [{
        "slide": 0,
        "title": "Global Child Mortality",
        "text": "<p>Globally and regionally, Under-5 Mortality (U5MR) is decreasing. However, globally, we are still far from reaching the Millennium Development Goals (MDG) in child mortality, with some countries faring far worse than others.</p><p class='hint'>Roll over the map to see the country- and world- Under-5 Mortality rates. This map is shaded to reflect the U5MR in each country. The most recent data for this chart is 2015.</p>"
                },
    {
        "slide": 1,
        "title": "Millenium Development Goals",
        "text": "<p>The Millenium Development Goal (MDG) target for Under-5 Mortality is as follows: <strong>“reduce child mortality globally by two-thirds, from 87* children of every 1,000 dying before age 5 in 1990 to 29 of every 1,000 in 2015”</strong> <a href='http://www.unicef.org/mdg/index_childmortality.htm' target='_blank'>(UNICEF)</a>. According to the most recent UNICEF report, the global Under-5 Mortality rate stands just below 43, and not yet reached the goal for 2015. </p><p class='note'>*There is a discrepancy between the MDG statement for the World Under-5 Mortality rate in 1990 and what the data shows. This is being looked into, but the chart below shows data that does not match the MDG statement.</p>"
                },
    {
        "slide": 2,
        "title": "Fertility Stands Out",
        "text": "<p>When comparing the relationships between various societal and economic factors to Under-5 Mortality rates, the tightest linear relationship shows to be with Fertility rates. <strong><em>Fertility Rate</em> refers to the number of children born per woman who reaches childbearing age.</strong></p><p class='hint'>You can hover over the points to view the country it represents and that country's position on each chart (where data is available)</p>"
                },
    {
        "slide": 3,
        "title": "Fertility Stands Out",
        "text": "<p>When comparing the relationships between various societal and economic factors to Under-5 Mortality rates, the tightest linear relationship shows to be with Fertility rates. <strong><em>Fertility Rate</em> refers to the number of children born per woman who reaches childbearing age.</strong></p><p>Trend lines and the r-value show how strong the correlation is. The closer to 1 or -1 the r-value, the stronger the correlation.</p><p>Fertility has the highest r-value, closely followed by Contraceptive Prevalence, which is <strong>the percentage of sexually active women who's partner or themselves are using a method of birth control</strong>. Given that contraception use is closely tied to pregnancies and fertility rates, this provides a greater indication that Fertility is closely tied to Under-5 Mortality.</p>"
                },

    {
        "slide": 4,
        "title": "Fertility & Mortality Over Time",
        "text": "<p>The relationship between Fertility rates and Under-5 Mortality rates have shown to hold up over time. This chart shows this relationship from 1970 to 2013.</p><p>Over time, Fertility rates and U5MR have decreased simultaneously, but the correlation between the two has remained strong.</p>"
                }
];