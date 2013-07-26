var margin = {top:20, right:40, bottom:0, left:65},
	width = 720 - margin.left - margin.right,
	height = 470 - margin.top - margin.bottom;

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
	.range([height- margin.top - margin.bottom, 0]);

var heightScale = d3.scale.linear()
	.range([0,height - margin.top - margin.bottom]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom');

var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left')
	.tickSize(10,10,0);

var svg = d3.select('#chartContainer').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
  .append('g')
  	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json("netbasedata2.json", function(error, data) {
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

	filteredData = data.filter(function(d) { return d.metric == "posts"; });
	
	x.domain(filteredData.map(function(d) { return d.date; }));
	y.domain([0, d3.max(filteredData, function(d) {return d.value;})])
	heightScale.domain([0, d3.max(filteredData, function(d) {return d.value;}) ])

	d3.select(".title_eachbar").selectAll(".title_eachbar_text")
		.data(data)
		.text(function(d) {return d.metric; });

	var bar = svg.selectAll('rect')
		.data(filteredData);
	bar.enter()
		.append('rect')
		.attr('width', x.rangeBand())
		.attr('height', 0)
		.attr('x', function(d,i) {
  			return x(d.date)
		})
		.style("fill", "#1c578c")
		/*
		.attr('y', function(d) {return height - margin.top - margin.bottom - y(d.value)})
		*/
		.attr('y', height - margin.top - margin.bottom)

		.transition()
		.duration(1000)

		.attr('y', function(d,i) {
  			return height - margin.top - margin.bottom - heightScale(d.value)
		})
		.attr('height', function(d,i) {
  			return heightScale(d.value)
		})

	bar.exit()
		.transition()
		.duration(1000)
		.attr('height', 0)
		.attr('y', heightScale())
		.remove();

	svg.append("g")
      	.attr("class", "x axis")
      	.attr("transform", "translate(0," + (height - margin.top -margin.bottom) + ")")
      	.style("font-size", "8px")
      	.call(xAxis);

    svg.append("g")
    	.attr("class", "y axis")
    	.transition()
    	.style("font-size", "8px")
		.duration(1000)
    	.call(yAxis);

function redraw(newData, barColor) {

	x.domain(newData.map(function(d) { return d.date; }));
	y.domain([0, d3.max(newData, function(d) {return d.value;})])
	heightScale.domain([0, d3.max(newData, function(d) {return d.value;}) ])

	d3.select(".title_eachbar").selectAll(".title_eachbar_text")
		.data(newData)
		.transition()
		.duration(1000)
		.text(function(d) {return d.metric; });


	var newXAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom');

    var newYAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(10,10,0);

	var rect = svg.selectAll('rect')
		.data(newData, function(d) {return d.date; });
   	rect.enter()//.insert("g", ".axis")
   		.append('rect')
   		.attr('class', 'bar')
   		.attr('width', x.rangeBand())
		//.attr('height', 0)
		.attr('x', function(d,i) {
  			return x(d.date)
		})
		//.attr('y', height - margin.top - margin.bottom)

		.transition()
		.duration(1000)

		.attr('y', function(d,i) {
  			return height - margin.top - margin.bottom - heightScale(d.value)
		})
		.attr('height', function(d,i) {
  			return heightScale(d.value)
		})

		rect.transition()
			.duration(1000)
			.style("fill", barColor)
			.attr('width', x.rangeBand())
		.attr('height', function(d,i) {
  			return heightScale(d.value)
		})
		.attr('x', function(d,i) {
  			return x(d.date)
		})
		.attr('y', function(d,i) {
  			return height - margin.top - margin.bottom - heightScale(d.value)
		})

		rect.exit()
			.transition()
			.duration(1000)
			.attr('y', height - margin.top - margin.bottom)
			.attr('height', 0)
			.remove();

		svg.selectAll(".x.axis")
        	.transition()
        	.duration(1000)
        	.attr("transform", "translate(0," + (height - margin.top -margin.bottom) + ")")
        	.call(newXAxis);
    
    	svg.selectAll(".y.axis")
        	.transition()
        	.duration(1000)
        	.call(newYAxis);

}; // end of function redraw 

d3.selectAll("input[value=posts]").on("change", togglePosts);
d3.selectAll("input[value=impressions]").on("change", toggleImpressions);
d3.selectAll("input[value=passion]").on("change", togglePassion);
d3.selectAll("input[value=positive]").on("change", togglePositive);
d3.selectAll("input[value=negative]").on("change", toggleNegative);
d3.selectAll("input[value=net]").on("change", toggleNet);

function togglePosts() {
	postData = data.filter(function(d) { return d.metric == "posts"; });
	redraw(postData, "#1c578c");
};

function toggleImpressions() {
	impressionData = data.filter(function(d) {return d.metric == "impressions"; });
	redraw(impressionData, "#f29e38");
};

function togglePassion() {
	passionData = data.filter(function(d) {return d.metric == "passion"; });
	redraw(passionData, "#dd4646");
};

function togglePositive() {
	positiveData = data.filter(function(d) {return d.metric == "positive sentiment"; });
	redraw(positiveData, "#f2d750");
};

function toggleNegative() {
	negativeData = data.filter(function(d) {return d.metric == "negative sentiment"; });
	redraw(negativeData, "#f2e0c9");
};

function toggleNet() {
	netsentimentData = data.filter(function(d) {return d.metric == "net sentiment"; });
	redraw(netsentimentData, "#5787a5");
};

});


