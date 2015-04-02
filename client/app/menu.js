var width = window.innerWidth,
  height = window.innerHeight,
  padding = 3, // separation between nodes
  menuColor = "#cc6666", // fill color
  menuOffset = 110, // offset from middle
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
  .attr("class", function(d){return d.class})
  .attr("text-anchor", "middle")
  .attr("font-family", "'Raleway', sans-serif")
  .attr("font-weight", "400")
  .attr("font-size", "1.3em")
  .attr("fill", "black");

function tick(e) {
  circle
    .each(gravity(.2 * e.alpha))
    .each(collide(.5))
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
  
  text
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
  // get width/height of resized window, update SVG, data and force accordingly
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


// enter connect icons set up listener
var connectorIcons = [
  '<i id="email" class="connect-icon fa fa-envelope-square fa-5x"></i>',
  '<i id="linked-in" class="connect-icon fa fa-linkedin-square fa-5x"></i>',
  '<i id="facebook" class="connect-icon fa fa-facebook-official fa-5x"></i>',
  '<i id="github" class="connect-icon fa fa-github-square fa-5x"></i>'
];

connectorIcons.forEach(function(icon){
  $('body').append(icon);
})
$('.connect-icon').toggle();

var connect = function(){
  $('.connect-icon').toggle("slow");
};

$('.connect').on('click', function(){
  connect();
});

// enter about description and set up listener
var about = "<p id='about'>My passion for using tech for good stems from my experiences living in 15 of the world’s busiest cities. My background includes environmental advocacy, fundraising, and teaching. I also enjoy creative writing (mostly sci-fi) and once considered it as a vocation. But I had a revelation: why not learn how to turn all those exciting ideas into reality instead of just writing about them?<br><br>I talked to friends and mentors and rediscovered coding.<br><br>...I’ve been in love ever since.</p>"

$('body').append(about);
$('#about').toggle();

$('.about-me').on('click', function(){
  $('#about').toggle("slow");  
});
