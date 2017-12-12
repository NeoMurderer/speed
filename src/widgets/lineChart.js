import * as d3 from 'd3'

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 0,
    height = 0
// parse the date / time
let zoom

export default class Widget {
    constructor(options = {}) {
        this.options = {
            el: '#lineChart',
            data: [],
            ...options
        }

        this.draw = d3
        const sizes = document.querySelector(this.options.el).getBoundingClientRect()
        width = sizes.width - margin.left - margin.right
        height = sizes.height - margin.top - margin.bottom
        this.drawChart()
    }
    redraw(data) {
        const valueLine = d3.line()
            .x(function (d) {return x(d.x);})
            .y(function (d) {return y(d.y);});

        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);
        x.domain(d3.extent(data, function (d) {return d.x;}));
        y.domain([0, d3.max(data, function (d) {return d.y;})]);
        d3.selectAll(".line")
            .data([data]) // set the new data
            .attr("d", valueLine); // apply the new data values

        // d3.select(this.options.el).transition()
        // .duration(750)
        // .call(zoom.transform, d3.zoomIdentity);
    }
    drawChart() {
        var svg = d3.select(this.options.el)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
        const data = this.options.data

        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        const valueLine = d3.line()
            .x(function (d) {return x(d.x);})
            .y(function (d) {return y(d.y);});

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {return d.x;}));
        y.domain([0, d3.max(data, function (d) {return d.y;})]);

        // Add the valueline path.
        const view = svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueLine);

        // Add the X Axis
        const xAxis = d3.axisBottom(x)
        const gX = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        const yAxis = d3.axisLeft(y)
        const gY = svg.append("g")
            .call(yAxis);

        zoom = d3.zoom()
            .scaleExtent([1, 40])
            .translateExtent([[-100, -100], [width + 90, height]])
            .on("zoom", zoomed);

        function zoomed() {
            view.attr("transform", d3.event.transform);
            gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
            gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
        }

        // svg
        // .call(d3.zoom().on("zoom", function () {
        //    svg.attr("transform", d3.event.transform)
        // }))
    }
}
