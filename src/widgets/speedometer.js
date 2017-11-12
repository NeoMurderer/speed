export default class Speedometer {
    /**
     * 
     * @param {Draw} draw - draw object (d3) 
     */
    constructor(draw, options) {
        this.draw = draw
        options = {
            el: '#speedometer',
            label: 'Speed',
            size: 500,
            min: -1,
            max: 3,
            majorTicks: 5,
            minorTicks: 20,
            transitionDuration: 500,
            data: [
                {
                    timestamp: Date.now(),
                    value: 50,
                    max: 100
                }, {
                    timestamp: Date.now() - 60 * 60,
                    value: 70,
                    max: 100
                }
            ],
            get raduis() {
                return this.size * 0.97 / 2
            },
            get cx() {
                return this.size / 2
            },
            get cy() {
                return this.size / 2
            },
            get range() {
                return this.max - this.min
            },
            ...options
        }
        let fontSize = Math.round(options.size / 9);

        // Start draw circle
        const svg = draw.select(options.el)
            .append('svg')
            .attr('class', 'gauge')
            .attr('width', options.size)
            .attr('height', options.size)
            .data(options.data)

        svg.append('svg:circle')
            .attr('cx', options.cx)
            .attr('cy', options.cy)
            .attr('r', options.raduis)
            .style('fill', '#071738')

        svg.append('svg:circle')
            .attr('cx', options.cx)
            .attr('cy', options.cy)
            .attr('r', 0.9 * options.raduis)
            .style('fill', '#050A20')

        svg.append('svg:text')
            .attr('x', options.cx)
            .attr('y', options.cy / 2 + fontSize / 2)
            .attr('dy', fontSize / 2)
            .attr('text-anchor', 'middle')
            .text(options.label)
            .style('font-size', fontSize + 'px')
            .style('fill', '#fff')
            .style('stroke-width', '0px')

        this.svg = svg
        this.options = options

        // Draw Pointers
        this.drawPointer()
        this.drawLine()

        console.info(`Draw circle at ${options.el}`)
        console.debug(svg)

        this.redraw(options.min, 0);
        return this
    }
    transformRotate() {
        const { options, draw, svg } = this
        let _currentRotation = this._currentRotation
        
        let value = this.tempValue
        if (!value) {
            value = 0
        }
        var pointerContainer = svg.select(".pointerContainer");

        pointerContainer.selectAll("text").text(Math.round(value));

        var pointer = pointerContainer.selectAll("path");
        var pointerValue = value;
        if (value > options.max) pointerValue = options.max + 0.02 * options.range;
        else if (value < options.min) pointerValue = options.min - 0.02 * options.range;
        var targetRotation = (this.valueToDegrees(pointerValue) - 90);
        var currentRotation = this._currentRotation || targetRotation;
        var rotation = currentRotation + (targetRotation - currentRotation);
        this._currentRotation = targetRotation;
        if (!targetRotation) {
            console.log('error')
        }
        const result =  "translate(" + options.cx + ", " + options.cy + ") rotate(" + rotation + ")";
        console.info('result', result)
        return result
    }
    redraw(value, transitionDuration) {
        const {svg, options} = this
        var pointerContainer = svg.select(".pointerContainer");

        pointerContainer.selectAll("text").text(Math.round(value));

        this.tempValue = value
        var pointer = pointerContainer.selectAll("path");
        pointer.transition()
            .attr('transform', this.transformRotate.bind(this))
            .duration(undefined != transitionDuration ? transitionDuration : options.transitionDuration)
        //.delay(0)
        //.ease("linear")
    }
    buildPointerPath(value = this.options.min) {
        const { options, draw, svg } = this

        const valueToPoint = (value, factor) => {
            var point = this.valueToPoint(value, factor);
            point.x -= options.cx;
            point.y -= options.cy;
            return point;
        }
        var delta = options.range / 13;

        var head = valueToPoint(value, 0.85);
        var head1 = valueToPoint(value - delta, 0.12);
        var head2 = valueToPoint(value + delta, 0.12);

        var tailValue = value - (options.range * (1 / (270 / 360)) / 2);
        var tail = valueToPoint(tailValue, 0.28);
        var tail1 = valueToPoint(tailValue - delta, 0.12);
        var tail2 = valueToPoint(tailValue + delta, 0.12);

        return [head, head1, tail2, tail, tail1, head2, head];

    }
    drawLine() {
        const { options, draw, svg } = this

        let fontSize = Math.round(options.size / 9);

        var pointerContainer = svg.append("svg:g").attr("class", "pointerContainer")
            .attr('transform', this.transformRotate.bind(this))

        var midValue = (options.min + options.max) / 2;

        var pointerPath = this.buildPointerPath(midValue)

        var pointerLine = draw.line()
            .x(function (d) { return d.x })
            .y(function (d) { return d.y })

        pointerContainer.selectAll("path")
            .data([pointerPath])
            .enter()
            .append("svg:path")
            .attr("d", pointerLine)
            .style("fill", "#dc3912")
            .style("stroke", "#c63310")
            .style("fill-opacity", 0.7)


        pointerContainer.append("svg:circle")
            .attr("cx", options.cx)
            .attr("cy", options.cy)
            .attr("r", 0.12 * options.raduis)
            .style("fill", "#4684EE")
            .style("stroke", "#666")
            .style("opacity", 1);

        pointerContainer.selectAll("text")
            .data([midValue])
            .enter()
            .append("svg:text")
            .attr("x", options.cx)
            .attr("y", options.size - options.cy / 4 - fontSize)
            .attr("dy", fontSize / 2)
            .attr("text-anchor", "middle")
            .style("font-size", fontSize + "px")
            .style("fill", "#fff")
            .style("stroke-width", "0px");

    }
    drawPointer() {
        const { options, draw, svg } = this
        const majorDelta = options.range / (options.majorTicks - 1);
        let fontSize = Math.round(options.size / 9);
        for (let major = options.min; major <= options.max; major += majorDelta) {
            const minorDelta = majorDelta / options.minorTicks;

            // Draw small points
            for (let minor = major + minorDelta; minor < Math.min(major + majorDelta, options.max); minor += minorDelta) {
                const point1 = this.valueToPoint(minor, 0.75);
                const point2 = this.valueToPoint(minor, 0.85);

                svg.append("svg:line")
                    .attr("x1", point1.x)
                    .attr("y1", point1.y)
                    .attr("x2", point2.x)
                    .attr("y2", point2.y)
                    .style("stroke", "#fff")
                    .style("stroke-width", "1px");
            }

            // Draw big point
            const point1 = this.valueToPoint(major, 0.7);
            const point2 = this.valueToPoint(major, 0.85);
            svg.append("svg:line")
                .attr("x1", point1.x)
                .attr("y1", point1.y)
                .attr("x2", point2.x)
                .attr("y2", point2.y)
                .style("stroke", "#fff")
                .style("stroke-width", "2px");

            // Add text as point

            let anchor = 'middle'
            if (major == options.min) {
                anchor = 'start'
            } else if (major == options.max) {
                anchor = 'end'
            }
            console.log('DEBUG', major)
            const k = 1.05
            svg.append("svg:text")
                .attr("x", point1.x)
                .attr("y", point1.y * k)
                .attr("text-anchor", anchor)
                .text(major)
                .style("font-size", fontSize / 2 + "px")
                .style("fill", "#fff")
                .style("stroke-width", "0px")
        }

    }
    valueToDegrees(value) {
        const options = this.options
        return value / options.range * 270 - (options.min / options.range * 270 + 45)
    }
    valueToRadians(value) {
        return this.valueToDegrees(value) * Math.PI / 180
    }
    valueToPoint(value, factor) {
        const options = this.options
        return {
            x: options.cx - options.raduis * factor * Math.cos(this.valueToRadians(value)),
            y: options.cy - options.raduis * factor * Math.sin(this.valueToRadians(value))
        }
    }
}