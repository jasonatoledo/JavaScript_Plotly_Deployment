function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number // sample IDs
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // All pulling back washing frequency
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(meta => meta.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var holder = filteredSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    
    var otu_ids = holder.otu_ids;//.slice(0,10);
    var otu_labels = holder.otu_labels;//.slice(0,10);
    var sample_values = holder.sample_values;

    var sample_values10 = holder.sample_values.slice(0,10).reverse();
    console.log(otu_ids, otu_labels, sample_values);
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. map, sort, reverse, slice

    var yticks = otu_ids.slice(0,10).reverse();
    var yticksStr = yticks.map(tick => "OTU " + tick.toString());
    console.log(yticks);
    console.log(yticksStr);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values10,
      y: yticksStr,
      type: "bar",
      orientation: "h",
      text: otu_labels
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: sample_values
    };


    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    
    // Deliverable 2 // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"     
      },
      type: "scatter"
    }];
        
    // 2. Create layout for the bubble chart
  
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" }
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredSamples = samples.filter(meta => meta.id == sample);
    console.log(filteredSamples);
    // Create a variable that holds the first sample in the array.
    var holder = filteredSamples[0];
    console.log(holder);
    // 2. Create a variable that holds the first sample in the metadata array.
    var meta2 = data.metadata[0];
    console.log(meta2);

    // TRY: looping through all wreq values, grab

    var allMeta = data.metadata;
    console.log(allMeta);
    var allWfreq = allMeta.map(i => i.wfreq);
    console.log(allWfreq);
  
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    // var otu_ids = holder.otu_ids;//.slice(0,10);
    // var otu_labels = holder.otu_labels;//.slice(0,10);
    // var sample_values = holder.sample_values;

    // 3. Create a variable that holds the washing frequency. // keys values
    var washing = parseFloat(meta2.wfreq) * 1.0;
    var resultWashing = filteredSamples.wfreq;
    console.log(washing);
    console.log(resultWashing);

    var wfreq = data.metadata.map(freq => freq.wfreq == sample.wfreq);
    console.log(wfreq);
    var wfreqTrue = wfreq.filter(freq => sample.freq == true);
    console.log(wfreqTrue);

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).reverse();
    var yticksStr = yticks.map(tick => "OTU " + tick.toString());
    console.log(yticks);
    console.log(yticksStr);

    // D2: 3. Use Plotly to plot the data with the layout.
    d3.select("selDataset").on("change", buildCharts);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      // value: d3.select("selDataset").on("change", buildCharts),
      value: washing,
      gauge: {
        axis: { 
          range: [0, 10],
          tickwidth: 1,
          tickcolor: "black",
          showticklabels: true,
          tickmode: "linear",
          tick0: 0,
          dtick: 2
        },         
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red"},
          { range: [2, 4], color: "orange"},
          { range: [4, 6], color: "yellow"},
          { range: [6, 8], color: "yellowgreen"},
          { range: [8, 10], color: "green"}
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
     hovermode: "closest"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
