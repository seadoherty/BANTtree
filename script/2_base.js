
var margin = { top: 20, right: 90, bottom: 30, left: 90 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0,
  duration = 750,
  root;

var treemap = d3.tree().size([height, width]);

root = d3.hierarchy(treeData, function (d) {
  return d.children;
});

root.x0 = height / 2;
root.y0 = 0;
root.children.forEach(collapse);

update(root);

function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}