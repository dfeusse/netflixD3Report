var margin = {top:20, right:20, bottom:30, left:40},
	width = 700 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var hypdata = [
{"metric":"total_likes","date":"2013-May-5","value":11012},
{"metric":"total_likes","date":"2013-May-12","value":9942},
{"metric":"total_likes","date":"2013-May-19","value":13740},
{"metric":"total_likes","date":"2013-May-26","value":40926},
{"metric":"total_likes","date":"2013-June-2","value":15291},
{"metric":"total_likes","date":"2013-June-9","value":21544},
{"metric":"total_likes","date":"2013-June-16","value":39036},
{"metric":"total_likes","date":"2013-June-23","value":32967},
{"metric":"total_likes","date":"2013-June-30","value":29861},
{"metric":"total_likes","date":"2013-July-7","value":34658},
{"metric":"total_likes","date":"2013-July-14","value":23103}
];

var parseDate = d3.time.format("%Y-%m-%d")

var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1);
/*
var x = d3.time.scale()
	.rangeRoundBands([0, width], .1);
*/
var y = d3.scale.linear()
	.range([height, 0]);

var heightScale = d3.scale.linear()
	.range([0,50]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient('top');

var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left')
	.tickSize(10,10,0);

var svg = d3.select('#chartContainer').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
  .append('g')
  	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json("testdata.json", function(error, data) {
	{if (error) return console.log("there was an error loading the data: " + error);
	console.log("there are " + data.length + " elements in my dataset");
	console.log(data)
	
	}
/*
	data.forEach(function(d) {
		d.date = parseDate(d.date);
	});

	x.domain(d3.extent(data, function(d) {return d.date;}));

*/

	filteredData = data.filter(function(d) { return d.metric == "total_likes"; });
	x.domain(filteredData.map(function(d) { return d.date; }));
	heightScale.domain([0, d3.max(data, function(d) {return d.value;}) ])

	var bar = svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('width', x.rangeBand())
		.attr('height', function(d,i) {
  			return heightScale(d.value)
		})
		.attr('x', function(d,i) {
  			return x(d.date)
		})
		.attr('y', function(d,i) {
  			return 175 - heightScale(d.value)
		})
})

