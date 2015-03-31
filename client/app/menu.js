var width = window.innerWidth,
  height = window.innerHeight,
  padding = 3, // separation between nodes
  menuColor = "#cc6666", // fill color
  menuOffset = 100, // offset from middle
  textOffset = 6, // offset for text inside circle elements
  maxRadius = 50, // radii
  myWork =   { radius: 50, color: menuColor, cx: width/2, cy: height/2 + menuOffset, name: "My Work", class: "menu my-work" },
  connect = { radius: 49, color: menuColor, cx: width/2, cy: height/2 + menuOffset, name: "Connect", class: "menu connect" },
  aboutMe =   { radius: 37, color: menuColor, cx: width/2, cy: height/2 + menuOffset, name: "About", class: "menu about-me" },
  blog =   { radius: 32, color: menuColor, cx: width/2, cy: height/2 + menuOffset, name: "Blog", class: "menu blog" },
  cv =   { radius: 24, color: menuColor, cx: width/2, cy: height/2 + menuOffset, name: "CV", class: "menu cv" }

var n = 5, // total number of nodes
  m = 1; // number of distinct clusters

var nodes = [ myWork, connect, aboutMe, blog, cv ];

var force = d3.layout.force()
  .nodes(nodes)
  .size([width, height])
  .gravity(0)
  .charge(0)
  .on("tick", tick)
  .start();

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("position", 'fixed')
  .style("top", 0);

var circle = svg.selectAll("circle")
  .data(nodes)
  .enter().append("circle")
  .attr("class", function(d) {return d.class})
  .attr("r", function(d) { return d.radius; })
  .style("fill", function(d) { return d.color; })
  .call(force.drag);

var text = svg.selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .call(force.drag);

var textLabels = text
  .attr("x", function(d) { return d.cx; })
  .attr("y", function(d) { return d.cy + textOffset; })
  .text(function(d){
    console.log(d.name);
    return d.name;
  })
  .attr("text-anchor", "middle")
  .attr("font-family", "'Raleway', sans-serif")
  .attr("font-weight", "400")
  .attr("font-size", "1.3em")
  .attr("fill", "black");

function tick(e) {
  circle
    .each(gravity(.1 * e.alpha))
    .each(collide(.5))
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
  
  text
    .each(gravity(.2 * e.alpha))
    .each(collide(.5))
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y + textOffset; });
}

// Move nodes toward cluster focus.
function gravity(alpha) {
  return function(d) {
    d.y += (d.cy - d.y) * alpha;
    d.x += (d.cx - d.x) * alpha;
  };
}

// Resolve collisions between nodes.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + padding,
      nx1 = d.x - r,
      nx2 = d.x + r,
      ny1 = d.y - r,
      ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
          y = d.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

window.onresize = resize;

function resize(e){
  // get width/height with container selector (body also works)
  // or use other method of calculating desired values
  var width = window.innerWidth;
  var height = window.innerHeight;
  svg.attr('width', width);
  svg.attr('height', height);
  nodes.forEach(function(node){
    node.cx = width/2;
    node.cy = height/2 + menuOffset;
  })
  force.size([width, height]).resume();
}

$('.fa-envelope').hide();

$('.connect').on('click', function(){
  $('.fa-envelope').toggle();
});

