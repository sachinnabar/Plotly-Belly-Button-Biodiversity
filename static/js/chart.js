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
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  //Deliverable 1 - Bar Chart
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
  
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
       
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      
      //  5. Create a variable that holds the first sample in the array.
      var result = resultArray[0];
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      console.log(otu_ids);
      console.log(otu_labels);
      console.log(sample_values);
  
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. -- syntax: yticks(ticks, [labels], **kwargs)
  
      var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
                  
  
      // 8. Create the trace for the bar chart. 
      var barData = [
        {
         y: yticks, 
         x: sample_values.slice(0,10).reverse(),
         text: otu_labels.slice(0,10).reverse(),
         type: "bar",
         orientation: "h",
        }
      ];
  
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacterial Species (OTUs)",
        xaxis: {title: "Sample Amount" },
        yaxis: {title: "OTU ID"}
      };
  
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
  
      //Deliverable 2 - Bubble Chart
  
      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Jet"
        }
      }];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Top 10 Bacterial Species (OTUs)",
        xaxis: {title: "Sample Amount" },
        yaxis: {title: "OTU ID"}
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
  
      //Deliverable 3 - Gauge Chart
  
      var metadata = data.metadata;
      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);
      // 2. Create a variable that holds the first sample in the metadata array.
      var metaAnswer = metaArray[0];
      console.log(metaAnswer)
  
      
  
       // 3. Create a variable that holds the washing frequency.
       var washFreq = parseFloat(metaAnswer.wfreq)
       console.log(washFreq)
     
       
         // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
        steps: [
        { range: [0, 2], color: "#ed0022" },
        { range: [2, 4], color: "#fc6114" },
        { range: [4, 6], color: "#ffad00" },
        { range: [6, 8], color: "#4aa84e" },
        { range: [8, 10], color: "#009a60" }
       ]}
      }];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        font: { color: "black", family: "Arial" }
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
      
    });
  }
  