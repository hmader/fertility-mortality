var myTooltip = d3.select("body")
    .append("div")
    .attr("class", "myTooltip");


function prevSlide() {
    svg.classed("hide", false);
}

function nextSlide() {
    svg.classed("hide", true);
}