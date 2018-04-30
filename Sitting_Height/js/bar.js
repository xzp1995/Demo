var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

d3.csv("../data.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, ori_data) {
  if (error) throw error;

  // console.log(ori_data);

  data = [];

  data.push({type: "Female Manual", u60: 0, u65: 0, u70: 0, u75: 0, u80: 0, u85: 0, o85: 0});
  data.push({type: "Male Manual", u60: 0, u65: 0, u70: 0, u75: 0, u80: 0, u85: 0, o85: 0});
  data.push({type: "Female Power", u60: 0, u65: 0, u70: 0, u75: 0, u80: 0, u85: 0, o85: 0});
  data.push({type: "Male Power", u60: 0, u65: 0, u70: 0, u75: 0, u80: 0, u85: 0, o85: 0});
  data.push({type: "Female Scooter", u60: 0, u65: 0, u70: 0, u75: 0, u80: 0, u85: 0, o85: 0});
  data.push({type: "Male Scooter", u60: 0, u65: 0, u70: 0, u75: 0, u80: 0,u85: 0, o85: 0});
  data.columns = ["type", "u60", "u65", "u70", "u75","u80", "u85", "o85"];

  ori_data.forEach(function(d){
    if(d.Gender === 1){
      append_data(data[d.WheelChair_Type * 2 - 2], d.Sitting_Ht);
    }
    else{
      append_data(data[d.WheelChair_Type * 2 - 1], d.Sitting_Ht);
    }

  })

  // console.log(data);

  var keys = data.columns.slice(1);

  x0.domain(data.map(function(d) { return d.type; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  g.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2) + 10)
    .attr("text-anchor", "middle")  
    .attr("font-weight", "bold")
    .style("font-size", "20px")  
    .text("Sitting Height Grouped by Gender and WheelChair Type");

  g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.type) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Number of people");

  // console.log(keys.slice().reverse());
  legend_text = ["under 600", "600 to 650", "650 to 700", "700 to 750", "750 to 800", "800 to 850", "over 850"];
  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(legend_text)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});

function append_data(b, h){
  if(h < 600){
    b.u60 += 1;
  }
  else if(h >= 600 && h < 650){
    b.u65 += 1;
  }
  else if(h >= 650 && h < 700){
    b.u70 += 1;
  }
  else if(h >= 700 && h < 750){
    b.u75 += 1;
  }
  else if(h >= 750 && h < 800){
    b.u80 += 1;
  }
  else if(h >= 800 && h < 850){
    b.u85 += 1;
  }
  else{
    b.o85 += 1;
  }
}