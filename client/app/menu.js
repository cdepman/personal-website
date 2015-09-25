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
    cursor = 'pointer'

var menuItems = {
  "CV": 24,
  "Blog": 32,
  "About": 37,
  "Connect": 49,
  "My Work": 50
}

var n = Object.keys(menuItems).length, // total number of nodes
    m = 1; // number of distinct clusters

function nodeBuilder(label, radius){
  return {
    radius: radius * radiusOffset, 
    color: menuColor, 
    cx: width/2, 
    cy: height/2 + menuOffset, 
    name: label, 
    class: "modal-trigger menu " + label.toLocaleLowerCase().replace(/\s/g, "-"), 
    textSize: textSize,
    cursor: cursor 
  }
}

function generateNodeArray(){
  var nodeArray = [];
  for (key in menuItems) {
    nodeArray.push(nodeBuilder(key, menuItems[key]))
  }
  return nodeArray;
}


var nodes = generateNodeArray(menuItems);

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
    .each(gravity(.03 * e.alpha))
    .each(collide(.7))
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

function focusNode(name){
  resetRadii()
  for (var i = 0; i < nodes.length; i++){
    if (nodes[i].name === name){
      nodes[i].radius += 10;
    }
  }

  function tick(e) {
  circle
    .each(gravity(.006 * e.alpha))
    .each(collide(.7))
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
  
  text
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y + textOffset; });
  }

  d3.layout.force()
  .nodes(nodes)
  .size([width, height])
  .gravity(0)
  .charge(0)
  .on("tick", tick)
  .start();
}

function resetRadii(){
  for (var i = 0; i < nodes.length; i++){
    nodes[i].radius = menuItems[nodes[i].name]
  }
}

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

  window.onresize = resize;

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


  $('circle.menu.my-work').on('mouseleave', function(){
    resetRadii()
    force.stop()
    $(this).css('stroke-width', 1);
  })
  $('circle.menu.blog').on('mouseleave', function(){
    resetRadii()
    force.stop()
    $(this).css('stroke-width', 1);
  })
  $('circle.menu.cv').on('mouseleave', function(){
    resetRadii()
    force.stop()
    $(this).css('stroke-width', 1);
  })
  $('circle.menu.connect').on('mouseleave', function(){
    resetRadii()
    force.stop()
    $(this).css('stroke-width', 1);
  })
  $('circle.menu.about').on('mouseleave', function(){
    resetRadii()
    force.stop()
    $(this).css('stroke-width', 1);
  })
  $('circle.menu.my-work').on('mouseenter', function(){
    focusNode("My Work")
    $('circle.menu').css('stroke-width', 1);
    $(this).css('stroke-width', 2.5);
  })
  $('circle.menu.blog').on('mouseenter', function(){
    focusNode("Blog")
    $('circle.menu').css('stroke-width', 1);
    $(this).css('stroke-width', 2.5);
  })
  $('circle.menu.cv').on('mouseenter', function(){
    focusNode("CV")
    $('circle.menu').css('stroke-width', 1);
    $(this).css('stroke-width', 2.5);
  })
  $('circle.menu.connect').on('mouseenter', function(){
    focusNode("Connect")
    $('circle.menu').css('stroke-width', 1);
    $(this).css('stroke-width', 2.5);
  })
  $('circle.menu.about').on('mouseenter', function(){
    focusNode("About")
    $('circle.menu').css('stroke-width', 1);
    $(this).css('stroke-width', 2.5);
  })
  $('text.about').on('mouseenter', function(){
    focusNode("About");
    $('circle.about').css('stroke-width', 2.5);
  });
  $('text.blog').on('mouseenter', function(){
    focusNode("Blog")
    $('circle.blog').css('stroke-width', 2.5);
  });
  $('text.cv').on('mouseenter', function(){
    focusNode("CV")
    $('circle.cv').css('stroke-width', 2.5);
  });
  $('text.connect').on('mouseenter', function(){
    focusNode("Connect")
    $('circle.connect').css('stroke-width', 2.5);
  });
  $('text.my-work').on('mouseenter', function(){
    focusNode("My Work")
    $('circle.my-work').css('stroke-width', 2.5);
  });

  // enter about description and set up listener
  $('.about').on('click', function(){
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
    setTimeout(function(){
      $('.title').css('z-index', 1);
    }, 500);
    $('.cv-options').fadeOut();
  })

  $('.modal-close').on('click',function(){
    $('#lean_overlay').fadeOut();
    $('#modal1').fadeOut();
    $('#head-shot').fadeOut();
    setTimeout(function(){
      $('.title').css('z-index', 1);
    }, 500);
  })

  $('.cv').on('click', function(){
    window.open('/assets/CharlieDepmanResume.pdf', '_blank');
  });

  $('.my-work').on('click', function(){
    window.location.href = 'myWork.html';
  });

  $('.blog').on('click', function(){
    window.open('http://madpen.azurewebsites.net', '_blank');
  });

  $('i.close-connectors').on('click', function(){
    $('#lean_overlay').fadeOut("slow");
    $('.close-connectors ').fadeOut("fast");
    $('.connectors').slideUp("slow");
    $('.connectors-background').fadeOut("slow");
    $('.connectors-outline').fadeOut("slow");
  });

});
