'use strict';
$(function(){
  // Setting up the chart area
  var margin = {
    top: 40,
    right: 20,
    bottom: 30,
    left: 40
  };
  var canvasWidth = 400;
  var canvasHeight = 300;
  var width = canvasWidth - margin.left - margin.right;
  var height = canvasHeight - margin.top - margin.bottom;
  var svg = d3.select('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight);
  // Add area for points
  var graphArea = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  // Add tooltip
  var div = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
  var xScale;
  var yScale;
  var color;
  var xColumn;
  var yColumn;


  d3.csv('pgdata.csv', function(error, data) {
      data.forEach(function(d) {
          d.xValue_2012 = +d.xValue_2012;
          d.yValue_2012 = +d.yValue_2012;
          d.xColumn = +d.xColumn;
          d.yColumn = +d.yColumn;
      });
    
    // Set xScale, yScale and color
    xScale = d3.scaleLinear().domain([0, 2]).range([0, width]);
    yScale = d3.scaleLinear().domain([-4, 9]).range([height, 0]);
    color = d3.scaleOrdinal(d3.schemeCategory10);     
      
    // setup xAxis and yAxis
    graphArea.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + (height) + ')')
              .call(d3.axisBottom(xScale))   
             .append('text')
              .attr('class', 'label')
              .attr('x', width)
              .attr('y', -6)
              .style('text-anchor', 'end')
              .text('Population Growth');
      

     graphArea.append('g')
               .attr('class', 'y axis')
               .call(d3.axisLeft(yScale))
              .append('text')
               .attr('class', 'label')
               .attr('transform', 'rotate(-90)')
               .attr('y', 6)
               .attr('dy', '.71em')
               .style('text-anchor', 'end')
               .text('GDP Growth');
      
    //add points and fill color by category 
     graphArea.selectAll('circle')
               .data(data)
             .enter().append('circle')
               .attr('cx', function(d) {return xScale(d.xValue_2012);})
               .attr('cy', function(d) {return yScale(d.yValue_2012);})
               .attr('r', 5)
               .style('fill', function(d) {return color(d.category);})
               .on('mouseover', function(d) {
                   div.transition()
                     .duration(200)
                     .style('opacity', .9);
                   div.html(d['Country'] + '<br/> (' + d[xColumn] 
                   + ', ' + d[yColumn] + ')')
                     .style('left', (d3.event.pageX + 5) + 'px')
                     .style('top', (d3.event.pageY -28) + 'px');
                   })
               .on('mouseout', function(d) {
                  div.transition()
                    .duration(500)
                    .style('opacity', 0);
                  }); 
    
   //add legend  
    var legend = graphArea.selectAll('.legend')
        .data(color.domain())
       .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) { return "translate(0," + i * 20 + ")"; });
      
      legend.append('rect')
           .attr('x', width - 18)
           .attr('width', 18)
           .attr('height', 18)
           .style('fill', color);
      
      legend.append('text')
           .attr('x', width - 24)
           .attr('y', 9)
           .attr('dy', '.35em')
           .style('text-anchor', 'end')
           .text(function(d) {return d;});
      
  var originalYear = 2012;
  var maxYear = 2015;
  var year = originalYear;
  d3.select('#nextButton').on('click', function(event) {
    if (year == maxYear) {
      year = originalYear;
    } else {
      year = year + 1;
    };
    xColumn = 'xValue_' + String(year);
    yColumn = 'yValue_' + String(year);
    
  //Animate changing the points shown by year here

    graphArea.selectAll('circle')
      .data(data)
      .transition()
      .duration(200)
      .attr('r', 5)
      .attr('cx', function(d) {return xScale(d[xColumn]);})
      .transition()
      .duration(200)
      .attr('r', 5)
      .attr('cy', function(d) {return yScale(d[yColumn]);});
      
  
// add labels 
    graphArea.selectAll('text')
             .data(data)
             .enter()
             .append('text')
             .text(function(d) {return d;});
 //Update the year on HTML
      
    d3.select('#status')
      .text('Year: '+year);

});
  });



});

// Step 5: make some other change to the graph
// I added 1) axis titles
//         2) legends
//         3) tooltips with mousehover 
