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
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    });
}

//  Create the buildCharts function.
function buildCharts(sample) {
    //  Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
        //  Create a variable that holds the samples array. 
        var samples = data.samples;

        //  Create a variable that filters the samples for the object with the desired sample number.
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

        //  Create a variable that holds the first sample in the array.

        var result = resultArray[0];
        var metadata = metadataArray[0];
        //  Create variables that hold the otu_ids, otu_labels, and sample_values.

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // 3. Create a variable that holds the washing frequency.
        var freq = parseFloat(metadata.wfreq);

        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        // Create the trace for the bar chart. 
        var barData = [{

            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",

        }];

        // Create the layout for the bar chart. 
        var barLayout = {
            title: "<b>Top 10 Bacteria Cultures Found</b>",
            margin: { t: 50, l: 180 },
            paper_bgcolor: "lightgray"

        };

        //10. Use Plotly to plot the data with the layout. 
        Plotly.newPlot("bar", barData, barLayout);

        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }

        }];

        //  Create the layout for the bubble chart.
        var bubbleLayout = {
            title: "<b>Bacteria Cultures Per Sample</b>",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 40 }

        };

        // Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // 4. Create the trace for the gauge chart.

        var gaugeData = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: freq,
            title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
                bar: { color: "black" },
                steps: [
                    { range: [0, 2], color: "red" },
                    { range: [2, 4], color: "orange" },
                    { range: [4, 6], color: "yellow" },
                    { range: [6, 8], color: "lawngreen" },
                    { range: [8, 10], color: "green" },
                ],
                threshold: {
                    line: { color: "black", width: 2 },
                    thickness: 0.75,
                    value: 10,
                },
            },
        }, ];

        // 5. Create the layout for the gauge chart.
        var gaugeLayout = {
            width: 460,
            height: 450,
            margin: { t: 0, b: 0 },
            font: { color: "darkblue", family: "Arial" },
            paper_bgcolor: "lightgray"
        };

        // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    });
}