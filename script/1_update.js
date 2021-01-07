function update(source) {
  var treeData = treemap(root);
  var nodes = treeData.descendants();
  var links = treeData.descendants().slice(1);

  nodes.forEach(d => d.y = d.depth * 180);

  var node = svg
  .selectAll("g.node")
  .data(nodes, d => d.id || (d.id = ++i));

  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", (d) => "translate(" + source.y0 + "," + source.x0 + ")")
    .on("click", click);

  nodeEnter
    .attr("class", "node")
    .attr("r", 1e-6)
    .style("fill", (d) => d.parent ? "rgb(39, 43, 77)" : "#FF5722");

  var circleWidth = 70;
  var circleHeight = circleWidth;
  var circleRx = circleWidth / 2;
  var circleRy = circleRx;

  nodeEnter.append("rect")
    .attr("rx", circleRx)
    .attr("ry", circleRy)
    .attr("stroke-width", (d) => d.parent ? 1 : 0)
    .attr("stroke", (d) => d.children || d._children ? "rgb(3, 192, 220)" : "rgb(39, 43, 77)")
    .attr("stroke-opacity", (d) => d.children || d._children ? "1" : "0.6")
    .attr("x", 0)
    .attr("y", -circleRy)
    .attr("width", circleWidth)
    .attr("height", circleHeight);

  nodeEnter
    .append("text")
    .style("fill", function (d) {
      if (d.parent) {
        return d.children || d._children ? "#ffffff" : "rgb(38, 222, 176)";
      }
      return "#ffffff";
    })
    .attr("dy", ".35em")
    .attr("x", circleRx)
    .attr("text-anchor", (d) => "middle")
    .text((d) => d.data.name);

  var nodeUpdate = nodeEnter.merge(node);

  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", (d) => "translate(" + d.y + "," + d.x + ")");

  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", (d) => "translate(" + source.y + "," + source.x + ")")
    .remove();

  nodeExit.select("rect").style("opacity", 1e-6);
  nodeExit.select("rect").attr("stroke-opacity", 1e-6);
  nodeExit.select("text").style("fill-opacity", 1e-6);
  var link = svg.selectAll("path.link").data(links, (d) => d.id);

  var linkEnter = link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
      var o = { x: source.x0, y: source.y0 };
      return diagonal(o, o);
    });

  var linkUpdate = linkEnter.merge(link);
  linkUpdate
    .transition()
    .duration(duration)
    .attr("d", (d) => diagonal(d, d.parent));

  link
    .exit()
    .transition()
    .duration(duration)
    .attr("d", function (d) {
      var o = { x: source.x, y: source.y };
      return diagonal(o, o);
    })
    .remove();

  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  function diagonal(s, d) {
    let path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
    return path;
  }

  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }
}