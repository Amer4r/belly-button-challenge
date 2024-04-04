const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// start the connect with the api using d3.json()
let urlData = d3.json(url)

urlData.then(function (data) {
    console.log(data);
    // Select the dropdown id from the html file
    let dropDownMenu = d3.select('#selDataset')
    // get the names from the data file and assign dynamicaly to the dropdown menu
    data.names.forEach((name) => {
        dropDownMenu.append("option").text(name).property("value", name)
    });

    // create a listen event for dropdown menu change
    dropDownMenu.on("change", function () {
        let nSample = d3.select(this).property("value")
        menuChange(nSample)
    });
    // Initializing the first page with the first values
    let fisrt_sample = data.names[0]
    charts(fisrt_sample)
    // buildBublle(fisrt_sample)
    demographic(fisrt_sample)
});

// function to create the bar and bubble charts
function charts(sample) {
    // get the data from the file and assign it to variables
    urlData.then((data) => {
        let samples = data.samples;
        let results = samples.filter(id => id.id == sample);
        let resultFirst = results[0];

        let sample_values = resultFirst.sample_values;
        let otu_ids = resultFirst.otu_ids;
        let otu_labels = resultFirst.otu_labels;

        // create the chart trace to plot it
        let bar_chart = [{
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
        }]
        // create a layout for the bar chart
        let bar_layout = {
            title: 'Top 10 OTUs bar chart',
            height: 500,
            width: 1000
        }
        // Plot the bar chart
        Plotly.newPlot('bar', bar_chart, bar_layout)

        // create the chart trace to plot it
        let bubble_chart = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            markers: {
                size: sample_values,
                color: otu_ids,
            }
        }]
        // create a layout for the bubble chart
        let bubble_layout = {
            title: 'Top 10 OTUs Bubble chart',
            height: 600,
            width: 1200,
            hovermode: 'closest',
        }
        // plot the bobble chart
        Plotly.newPlot('bubble', bubble_chart, bubble_layout)
    });
};

// create a function to plot the demographic information
function demographic(sample) {
    // get the data from the file and assign to variables
    urlData.then((data) => {
        let metadata = data.metadata;
        let results = metadata.filter(id => id.id == sample);
        let resultFirst = results[0];

        // select the id from the html file to plot the demographic 
        let meta = d3.select('#sample-metadata').html('')
        // create a header to add the demographic info into it
        Object.entries(resultFirst).forEach(([key, value]) => {
            meta.append('h6').text(`${key.toUpperCase()}: ${value}`);
        })
    })
}


// create a function to handle any change with the dropdown menu
function menuChange(data) {
    charts(data)
    demographic(data)

}