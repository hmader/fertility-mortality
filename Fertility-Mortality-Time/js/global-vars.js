var margin = {
        top: 10,
        right: 10,
        bottom: 30,
        left: 30
    },
    width = 600 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var fertilityDataset;
var mortalityDataset;

var svg;

var dateFormat = d3.time.format("%Y");