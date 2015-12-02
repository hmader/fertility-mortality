/*======================================================================
     Mouse Events
   ======================================================================*/

function mouseoverFunc(d) {
    console.log(d);
    myTooltip
        .style("opacity", 1)
        .style("display", null)
        .html("<p><span class='tooltipHeader'>" + "hovering" + "</span><br></p>");
}

   function mousemoveFunc(d) {
        return myTooltip
            .style("top", (d3.event.pageY - 5) + "px")
            .style("left", (d3.event.pageX + 15) + "px");
    }

    function mouseoutFunc(d) {
        return myTooltip.style("display", "none"); // this sets it to invisible!
    }

/*======================================================================
======================================================================*/