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