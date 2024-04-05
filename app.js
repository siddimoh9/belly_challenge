const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

function buildMetadata(sample) {
  d3.json(url).then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Select the panel with id of sample-metadata
    let panel = d3.select("#sample-metadata");

    // Clear any existing metadata
    panel.html("");

    // Append new tags for each key-value pair in the metadata
    Object.entries(result).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {
  d3.json(url).then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Build a Bubble Chart
    let bubbleLayout = { title: "Bubble Chart for Sample" };
    let bubbleData = [{
      x: result.otu_ids,
      y: result.sample_values,
      text: result.otu_labels,
      mode: "markers",
      marker: {
        size: result.sample_values,
        color: result.otu_ids
      }
    }];
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Build a Bar Chart
    let barData = [{
      x: result.sample_values.slice(0, 10).reverse(),
      y: result.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: result.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];
    let barLayout = { title: "Bar Chart for Sample" };
    Plotly.newPlot("bar", barData, barLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  let dropdown = d3.select("#sampleDropdown");

  // Use the list of sample names to populate the select options
  d3.json(url).then((data) => {
    let sampleNames = data.names;
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
