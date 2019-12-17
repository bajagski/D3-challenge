// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params

var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(stateData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
        d3.max(stateData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height,0]);
  
    return yLinearScale;
  
  }

  // function used for updating var upon click on axis label
  
function renderAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }


  // function used for updating circles group 
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

  function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

    // function used for updating text
function renderTexts(textsGroup, newXScale, chosenXAxis) {

  textsGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));

  return textsGroup;
}

function renderYTexts(textsGroup, newYScale, chosenYAxis) {

  textsGroup.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis]));

  return textsGroup;
}

  // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {


    if (chosenXAxis === "poverty") {
    var xLabel = "In Poverty (%)";
    } else if (chosenXAxis === "age") {
    var xLabel = "Age (Median)";
    } else {
    var xLabel = "Household Income (Median)";
    }

    if (chosenYAxis === "healthCare") {
    var  yLabel = "Lacks Healthcare (%)";
    } 
    else if (chosenYAxis === "smokes") {
    var yLabel = "Smokes (%)";
    } 
    else {
    var yLabel = "Obesity (%)";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([1, 1])
      .html(function(d) {
        return (`${d.state} <br>${xLabel}: ${d[chosenXAxis]} <br>${yLabel}: ${d[chosenYAxis]}`)
      });
      

    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
  

  // Retrieve data from the CSV file and execute everything below

d3.csv("assets/data/data.csv").then(function (stateData) {

    console.log(stateData);
  
    // parse data
    stateData.forEach(function (data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(stateData, chosenXAxis);
  
    // Create y scale function
    var yLinearScale = yScale(stateData, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 9)
      .attr("fill", "blue")
      .attr("opacity", ".5");
  
    var textsGroup = chartGroup.selectAll("circles")
      .data(stateData)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("dx", function (d) {
        return xLinearScale(d[chosenXAxis]);
      })
      .attr("dy", function (d) {
        return yLinearScale(d[chosenYAxis] / 1.005);
      })
      .attr("class", "stateText")
      .attr("font-size", 8);
  
    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2.5}, ${height + 14})`);
  
    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Proverty (%)");
  
    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");
  
    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");
  

  // append y axis 
  var labelYGroup = chartGroup.append("g")
  .attr("transform", `rotate(-90)`)
  .attr("dy", "1em");
  
  var healthLabel = labelYGroup.append("text")
  .attr("y", 0 - margin.left+ 60)
  .attr("x", 0 - (height / 2))
  .attr("value", "healthcare") // value to grab for event listener
  .classed("active", true)
  .text("Lacks Healthcare (%)");
  
  //  append y axis for second label
  var smokeLabel = labelYGroup.append("text")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("value", "smokes")
  .classed("inactive", true)
  .text("Smokes (%)");
  
  // append 3rd label for y-axis
  var obesityLabel = labelYGroup.append("text")
  .attr("y", 0 - margin.left + 20)
  .attr("x", 0 - (height / 2))
  .attr("value", "obesity")
  .classed("inactive", true)
  .text("Obese (%)");
  
    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replace chosenXAxis with value
          chosenXAxis = value;
  
          // updates x scale for new data
          xLinearScale = xScale(stateData, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderAxis(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
          textsGroup = renderTexts(textsGroup, xLinearScale, chosenXAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        }
      });
  
      // y axis labels event listener
      labelYGroup.selectAll("text")
      .on("click", function() {

        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
  
          chosenYAxis = value;

          yLinearScale = yScale(stateData, chosenYAxis);
  
          yAxis = renderYAxis(yLinearScale, yAxis);
  
          circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
          textsGroup = renderYTexts(textsGroup, yLinearScale, chosenYAxis);
  

          circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        }
      });  
       
  });

  
