var margin = {top: 20, right: 20, bottom: 20, left: 20},
  width = 500 - margin.right - margin.left,
  height = 500 - margin.top - margin.bottom,
  radius = width/2;

var color = d3.scaleOrdinal()
  .range(["#AED6F1", "#A3E4D7", "#F9E79F"]);

var arc = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(0);

var labelArc = d3.arc()
  .outerRadius(radius - 100)
  .innerRadius(radius - 100);

var pie = d3.pie()
  .sort(null)
  .value(function(d) { return d.count; });

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var svg2 = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("../data.csv", function(error, data) {
  if (error) throw error;
  
  var group1 = [];
  var group2 = [];
  group1.push({type: "Female", count: 0});
  group1.push({type: "Male", count: 0});
  group2.push({type: "Manual", count: 0});
  group2.push({type: "Power", count: 0});
  group2.push({type: "Scooter", count: 0});

  data.forEach(function(d) {
    if (d.Gender === "1" ) {
      group1[0].count += 1;
    }
    else{
      group1[1].count += 1;
    }
    if(d.WheelChair_Type === "1"){
      group2[0].count += 1;
    }
    else if(d.WheelChair_Type === "2"){
      group2[1].count += 1;
    }
    else{
      group2[2].count += 1;
    }
  })
  // console.log(group);

  var g = svg.selectAll(".arc")
    .data(pie(group1))
    .enter().append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color(d.index); })
    .transition()
    .ease(d3.easeLinear)
    .duration(500)
    .attrTween("d", Pietrans);

  g.append("text")
    .transition()
    .ease(d3.easeLinear)
    .duration(500)
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.data.type; });
    
  var g2 = svg2.selectAll(".arc")
    .data(pie(group2))
    .enter().append("g")
    .attr("class", "arc");

  g2.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color(d.index); })
    .transition()
    .ease(d3.easeLinear)
    .duration(500)
    .attrTween("d", Pietrans);

  g2.append("text")
    .transition()
    .ease(d3.easeLinear)
    .duration(500)
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.data.type; });
    
});

function Pietrans(b) {
  b.innerRadius = 0;
  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
  return function(t) { return arc(i(t)); };
}
