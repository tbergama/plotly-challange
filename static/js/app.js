// d3.json("samples.json", function() {
    
// });

d3.json("samples.json").then(function(data) {
    // console.log(data);

    dropdown = d3.select("#selDataset");

    // Populate dropdown
    data.names.forEach(function(name) {
        var option = dropdown.append("option");
        option.text(name);
    });

    function init() {
        var selected_data = data.samples[0];

        var reformatted = [];

        // Reformat data
        for (var i = 0; i < selected_data.sample_values.length; i++) {
            reformatted.push({
                sample_value: selected_data.sample_values[i],
                otu_id: selected_data.otu_ids[i],
                otu_label: selected_data.otu_labels[i]
            })
        };

        selected_data = reformatted

        // Sort for top 10
        var top_10 = selected_data.sort((x, y) => y.sample_value - x.sample_value).slice(0, 10);
        
        //console.log(top_10.map(x => x.sample_value));
        //console.log(top_10.map(x => "ID"+String(x.otu_id)));

        bar_data = [{
            type: 'bar',
            x: top_10.map(x => x.sample_value),
            y: top_10.map(x => "ID"+String(x.otu_id)),
            text: top_10.map(x => x.otu_label),
            orientation: 'h'
        }];

        bar_layout = {
            // Bar Chart Layout
        };

        bubble_data = [{
            x: selected_data.map(x => x.otu_id),
            y: selected_data.map(x => x.sample_value),
            mode: 'markers',
            text: selected_data.map(x => x.otu_label),
            marker: {
                size: selected_data.map(x => x.sample_value),
                color: selected_data.map(x => x.otu_id)
            }
        }];

        bubble_layout = {
            // Bubble Chart Layout
        };

        Plotly.newPlot("bar", bar_data, bar_layout);
        Plotly.newPlot("bubble", bubble_data, bubble_layout);

        // Populate table
        selected_meta = data.metadata.filter(x => x.id == data.samples[0].id)[0];
        console.log(selected_meta);

        demo_div = d3.select("#sample-metadata")
        Object.entries(selected_meta).forEach(([key, value]) => {
            var d = demo_div.append("div");
            d.text(key+": "+value);
        });
    };

    // Update plots and metadata on dropdown change
    dropdown.on("change", function() {
        var selected_data = data.samples.filter(x => x.id == this.value)[0];

        var reformatted = [];

        // Reformat data
        for (var i = 0; i < selected_data.sample_values.length; i++) {
            reformatted.push({
                sample_value: selected_data.sample_values[i],
                otu_id: selected_data.otu_ids[i],
                otu_label: selected_data.otu_labels[i]
            })
        };

        selected_data = reformatted

        console.log(selected_data)

        // Sort for top 10
        var top_10 = selected_data.sort((x, y) => y.sample_value - x.sample_value).slice(0, 10);
        console.log(top_10);

        var bar_update = {
            x: top_10.map(x => x.sample_value),
            y: top_10.map(x => "ID"+String(x.otu_id)),
            text: top_10.map(x => x.otu_label)
        };

        Plotly.restyle("bar", bar_update);

        var bubble_update = {
            x: selected_data.map(x => x.otu_id),
            y: selected_data.map(x => x.sample_value),
            text: selected_data.map(x => x.otu_label),
            'marker.size': selected_data.map(x => x.sample_value),
            'marker.color': selected_data.map(x => x.otu_id)
        };

        Plotly.restyle("bubble", bubble_update);
        
        var selected_meta = data.metadata.filter(x => x.id == this.value)[0];
        console.log(selected_meta);

        demo_div = d3.select("#sample-metadata")
        demo_div.html("");
        Object.entries(selected_meta).forEach(([key, value]) => {
            var d = demo_div.append("div");
            d.text(key+": "+value);
        });
    });

    init();
});


