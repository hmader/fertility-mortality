var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

var radius = 10;

var x = 25;
var y = height - 25;

var svg = d3.select('#svg').append('svg')
    .attr('width', width)
    .attr('height', height);

var nodes = [
    {x:  Math.random() * width, y:  Math.random() * height},
    {x:  Math.random() * width, y:  Math.random() * height}
];

//addCircle();

window.setInterval(function(){
    svg.append("circle")
        .attr("r", radius)
        .attr("cx", function() { return Math.random() * width; })
        .attr("cy", function() { return Math.random() * height; })
        .attr("fill", "#242424")
        .attr("opacity", 1);
}, 3000);

//
//function addCircle() {
//
//    svg.append("circle")
//        .attr("r", radius)
//        .attr("cx", x)
//        .attr("cy", y)
//        .attr("fill", "#242424")
//        .attr("opacity",1);
//
//    if(x < width - 35) {
//
//        x += 25;
//    } else {
//
//        x = 25;
//        y -= 25;
//    }
//}
// window.setInterval(function(){
//    addCircle();
//}, 3000);

