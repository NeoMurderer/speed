import * as d3 from 'd3'
export default class Chart {
    /**
     * 
     * @param {d3} draw 
     * @param {*} options 
     */
    constructor(draw, options = {}) {
        this.options = {
            el: '#chart',
            width: 500,
            height: 500,
            ...options
        }
        this.$draw = draw
        this.drawChart()
    }
    /**
     * @return {Date} date
     */
    get minDate() {
        const { data } = this.options
        if (!data) { return new Date() }
        const minDate = Math.min(...data.map(point => point.timestamp))
        return new Date(minDate)
    }
    /**
     * @return {Date} date
     */
    get maxDate() {
        const { data } = this.options
        if (!data) { return new Date() }
        const maxDate = Math.max(...data.map(point => point.timestamp))
        return new Date(maxDate)
    }
    /**
     * @return {Int} speed
     */
    get minValue() {
        const { data } = this.options
        if (!data) { return 0 }
        const minValue = Math.min(...data.map(point => point.speed))
        return minValue
    }
    /**
     * @return {Int} speed
     */
    get maxValue() {
        const { data } = this.options
        if (!data) { return 0 }
        const maxValue = Math.max(...data.map(point => point.speed))
        return maxValue
    }
    drawChart() {
        const { options, $draw } = this
        const svg = $draw.selectAll(options.el).append('svg')

        svg.attr('width', options.width)
            .attr('height', options.height)

        console.info(this.minDate, this.maxDate)
        const timeRange = $draw.scaleTime().domain([this.minDate, this.maxDate])
        const speedRange = $draw.scaleLinear().domain([this.maxValue, this.minValue])

        timeRange.range([0, options.width])
        speedRange.range([0, options.height - 50])

        const timeAxis = $draw.axisBottom(timeRange)
        const speedAxis = $draw.axisLeft(speedRange)

        svg.append('g')
            .attr('transform', `translate(30, ${options.height - 50})`)
            .call(timeAxis)
        svg.append('g')
            .attr('transform', `translate(30, 0)`)
            .call(speedAxis)

            
        var lineFun = $draw.line()
        .x(function(d){return timeRange(new Date(d.timestamp))})
        .y(function(d){return speedRange(d.speed)})
        const curve = svg.selectAll(".people")
            .data(options.data)
            .enter()
            .append('g')
            .attr('d', lineFun)
    }
}