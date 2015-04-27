var width = window.innerWidth,
  height = window.innerHeight,
  padding = 3, // separation between nodes
  menuColor = "transparent", //["#D9ECF4", "#BBE5F7", "#7BD0F2", "#74ACF2", "#0094F7"], // fill color
  menuOffset = height < 750 ? 50 : 110, // offset from middle
  radiusOffset = height < 750 ? .7 : 1,
  textSize = height < 750 ? '1em' : '1.3em',
  textColor = "white",
  textOffset = 6, // offset for text inside circle elements
  maxRadius = 50 * radiusOffset, // radii
  cursor = 'pointer',
  myWork =   { radius: 50 * radiusOffset, color: menuColor, cx: width/2, cy: height/2 + menuOffset, name: "My Work", class: "modal-trigger menu my-work", textSize: textSize, cursor: cursor },
  connect = { radius: 49 * radiusOffset, color: menuColor, cx: width/2, cy: height/2 + menuOffset, name: "Connect", class: "modal-trigger menu connect", textSize: textSize, cursor: cursor },
  aboutMe =   { radius: 37 * radiusOffset, color: menuColor, cx: width/2, cy: height/2 + menuOffset, name: "About", class: "modal-trigger menu about-me", textSize: textSize, cursor: cursor },
  blog =   { radius: 32 * radiusOffset, color: menuColor, cx: width/2, cy: height/2 + menuOffset, name: "Blog", class: "modal-trigger menu blog", textSize: textSize, cursor: cursor },
  cv =   { radius: 24 * radiusOffset, color: menuColor, cx: width/2, cy: height/2 + menuOffset, name: "CV", class: "modal-trigger menu cv", textSize: textSize, cursor: cursor }

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
  .attr("href", "#modal1")
  .attr("class", function(d) {return d.class})
  .attr("r", function(d) { return d.radius; })
  .style("fill", function(d) { return d.color; })
  .style("cursor", function(d) { return d.cursor; })
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
    return d.name;
  })
  .attr("class", function(d){return d.class})
  .attr("text-anchor", "middle")
  .attr("font-family", "'Raleway', sans-serif")
  .attr("font-weight", "200")
  .attr("font-size", function(d){return d.textSize})
  .attr("fill", textColor)
  .style("cursor", function(d) { return d.cursor; });


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

  menuOffset = height > 750 ? 110 : 50;
  radiusOffset = height > 750 ? 1 : .7;

  nodes.forEach(function(node){
    node.cx = width/2;
    node.cy = height/2 + menuOffset;
    node.radius = node.radius * radiusOffset;
  })

  force.size([width, height]).resume();
}


// enter connect icons set up listener
$(function(){

  var connections = '<div class="connectors"> <a target="_blank" href="mailto:cdepaman@gmail.com"> <i id="email" class="hvr-shrink connect-icon fa fa-envelope-square fa-5x"></i> </a> <a target="_blank" href="http://linkedin.com/in/cdepman"> <i id="linked-in" class="hvr-shrink connect-icon fa fa-linkedin-square fa-5x"></i> </a> <a target="_blank" href="http://facebook.com/cdepman"> <i id="facebook" class="hvr-shrink connect-icon fa fa-facebook-square fa-5x"></i> </a> <a target="_blank" href="http://github.com/cdepman"> <i id="github" class="hvr-shrink connect-icon fa fa-github-square fa-5x"></i> </a> </div>';
  $('body').append(connections);
  $('.connectors').toggle();

  var connect = function(){
    $('.connectors').slideToggle("slow");
    $('#lean_overlay').fadeIn("fast");
    $('.connectors-background').fadeIn("slow");
    $('.connectors-outline').fadeIn("slow");
    $('.close-connectors').fadeIn("fast");
  };

  $('.connect').on('click', function(){
    connect();
  });

  $('circle.menu').on('mouseenter', function(){
    $(this).css('stroke-width', 2);
  })    
  $('circle.menu').on('mouseleave', function(){
    $(this).css('stroke-width', 1);
  })  
  $('text.about-me').on('mouseenter', function(){
    $('circle.about-me').css('stroke-width', 2);
  });
  $('text.blog').on('mouseenter', function(){
    $('circle.blog').css('stroke-width', 2);
  });
  $('text.cv').on('mouseenter', function(){
    $('circle.cv').css('stroke-width', 2);
  });
  $('text.connect').on('mouseenter', function(){
    $('circle.connect').css('stroke-width', 2);
  });
  $('text.my-work').on('mouseenter', function(){
    $('circle.my-work').css('stroke-width', 2);
  });

  // enter about description and set up listener
  $('.about-me').on('click', function(){
    $('#head-shot').fadeIn("fast");
    $('#lean_overlay').fadeIn();
    $('#modal1').fadeIn();
    $('#head-shot-outline').fadeIn("fast");
    $('.title').css('z-index', 10080);
  })

  $('#lean_overlay').on('click',function(){
    $('#lean_overlay').fadeOut("slow");
    $('#head-shot').fadeOut();
    $('.connectors').slideUp("slow");
    $('#modal1').fadeOut();
    $('#modal2').fadeOut();
    $('.connectors-background').fadeOut("slow");
    $('.connectors-outline').fadeOut("slow");
    $('.close-connectors').fadeOut("fast");
    $('.title').css('z-index', 1);
    $('.cv-options').fadeOut();
  })

  $('.modal-close').on('click',function(){
    $('#lean_overlay').fadeOut();
    $('#modal1').fadeOut();
    $('#head-shot').fadeOut();
    $('.title').css('z-index', 1);
  })

  $('.cv').on('click', function(){
    window.open('http://localhost:8000/assets/CharlieDepmanResume.pdf', '_blank');
  });

  $('.my-work').on('click', function(){
    window.location.href = 'myWork.html';
  });

  $('.blog').on('click', function(){
    window.open('http://cdepman.com', '_blank');
  });

  $('i.close-connectors').on('click', function(){
    $('#lean_overlay').fadeOut("slow");
    $('.close-connectors ').fadeOut("fast");
    $('.connectors').slideUp("slow");
    $('.connectors-background').fadeOut("slow");
    $('.connectors-outline').fadeOut("slow");
  });

});
