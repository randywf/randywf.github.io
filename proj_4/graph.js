function graph() {
  var margin = {top: 10, right: 30, bottom: 30, left: 40};
  var width = 1000 - margin.left - margin.right;
  var height = 1000 - margin.top - margin.bottom;

  var svg = d3.select("#netgraph")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")"
      );

  d3.json("./data/elephant.json", function(data){
    // Create degree attribute for nodes
    data.nodes.forEach(function(node) {
      node.deg = 0;
    });
    data.links.forEach(function(link) {
      data.nodes[link.source - 1].deg += 1;
    });

    svg.append("svg:defs").selectAll("marker")
      .data(["end"])      // Different link/path types can be defined here
    .enter().append("svg:marker")    // This section adds in the arrows
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10") // Size of box marker is placed in
      .attr("refX", 23.5) // Marker position rel. to link
      .attr("refY", 0)
      .attr("markerWidth", 8) // Marker size
      .attr("markerHeight", 8)
      .attr("orient", "auto") // Marker direction
    .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5") // Marker shape
      .attr("class", "arrow");

    // Initialize edges
    var link = svg
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("svg:line")
        .attr("class", "link")
        .attr("marker-end", "url(#end)");
    
    // Initialize nodes
    var node = svg
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("svg:circle")
        .attr("class", function(d) {
          if (d.deg == 0) {return "zero"};
          if (d.deg == 1) {return "one"};
          if (d.deg == 2) {return "two"};
          if (d.deg == 3) {return "three"};
          if (d.deg == 4) {return "four"};
          if (d.deg == 5) {return "five"}
        })
        .attr("r", function(d) {return d.deg + 10});
    
    // Define simulation
    var simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink()
        .id(function(d) {return d.id;})
        .links(data.links)
        .distance(30)
      )
      .force("collision", d3.forceCollide().radius(10))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2, 1))
      .force("radial", d3.forceRadial()
        .radius(10)
        .x(width / 2)
        .y(height / 2)
      )
      .on('tick', ticked);

    // Define tick function of simulation
    function ticked() {
      link
        .attr("x1", function(d) {return d.source.x;})
        .attr("y1", function(d) {return d.source.y;})
        .attr("x2", function(d) {return d.target.x;})
        .attr("y2", function(d) {return d.target.y;})
      node
        .attr("cx", function(d) {return d.x;})
        .attr("cy", function(d) {return d.y;})
    }
    console.log(svg)
  });
  return svg;
}