const COLOR = {
    inactive: '#071738'
}
const dashes = [0, 40, 80, 120, 160, 200, 240, 280]
const warningZone = 200
const dangetZone = 260
export default class Widget {
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
    constructor(draw, options = {}) {
        this.options = {
            el: '#widget',
            get size() {
                if (window.innerWidth > window.innerHeight) {
                    return window.innerHeight
                }
                return window.innerWidth
            },
            min: 0,
            max: 280,
            majorTicks: 8,
            minorTicks: 4,
            step: 40,
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
            get dashWidth() {
                return 1
            },
            get middleValue() {
                return this.range / 2
            },
            get barWidth() {
                return this.size / 20
            },
            get fontSize() {
                return (this.size / 20.7)
            },
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

        this.draw = draw

        this.drawCircle()
        // this.drawBand(this.container,warningZone, this.options.max, '#781321')
        // this.drawBand(this.container,dangetZone, this.options.max, '#3D0E22')
        this.drawDashes()
        this.drawText()
        const mainBar = this.drawBand(this.container,0, 60, '#1784F9', 'mainBar')
    }
    drawCircle() {
        const options = this.options
        let container = this.draw.select(options.el)
            .append('svg')
            .attr('class', 'gauge')
            .attr('width', options.size)
            .attr('height', options.size)

        container =  container.append("svg:g").attr("class", "pointerContainer");
        container.append('svg:circle')
            .attr('cx', options.cx)
            .attr('cy', options.cy)
            .attr('r', options.raduis)
            .style('fill', COLOR.inactive)

        container.append('svg:circle')
            .attr('cx', options.cx)
            .attr('cy', options.cy)
            .attr('r', options.raduis - options.barWidth)
            .style('fill', '#050A20')

        console.log('this.valueToRadians(options.max)', this.valueToRadians(options.max))
        var arc = this.draw.arc()
            .innerRadius(0)
            .outerRadius(options.raduis + 1)
            .startAngle((this.valueToRadians(options.max)))
            .endAngle((this.valueToDegrees(options.max) - 90) * Math.PI / 180)

        container.append('path')
            .style('fill', '#050A20')
            .attr('d', arc)

            .attr('transform', function (d) {
                return `translate( ${options.cx}, ${options.cy} )`;
            })
        console.info(`Draw circle with 
            cx:${options.cx} 
            cy:${options.cy}
            radius: ${options.raduis}
            color: ${COLOR.inactive}
            `)
        this.container = container
    }
    redraw(value, speed) {
        let color = '#1784F9'
        if (value >= warningZone) {
            color = '#B01922'
        }
        // const transition = this.mainBar.transition()
        const bar = this.draw.select(this.options.el).select('.mainBar')
        .transition()
        .duration(speed)
        .attr("d", this.getArc(0, value))

        this.container.selectAll('text.valueText').text(value)

       
        // transition.attr('d', this.draw.arc()
        //     .endAngle(this.valueToRadians(value)))
        //     .style('fill', color)
        //     .duration(speed)

        // transition
    }
    drawText() {
        const { options, draw, container } = this
        let fontSize = Math.round(options.raduis / 7);
        const middle = options.middleValue
        dashes.map(major => {
            let anchor = 'middle'
            let point = this.valueToPoint(major, .65);

            container.append('svg:text')
                .attr('y', point.y + 5)
                .attr('text-anchor', anchor)
                .text(major)
                .attr('x', function (d) {
                    const half = this.getBBox().width / 2
                    console.log(half)
                    if (middle < major) return point.x - half
                    return point.x + half
                })
                .style('font-size', fontSize / 2 + 'px')
                .style('fill', '#fff')
        })
        container.append('svg:text')
        .attr('x', function () { return options.cx - this.getBBox().width / 2})
        .attr('y', function () { return options.cy - this.getBBox().height / 2})
        .attr('class', 'valueText')
        .attr('text-anchor', 'middle')
        .text(60)
        .style('font-size', fontSize+ 'px')
        .style('fill', '#fff')

    }
    getArc(start, value) {
        const arc = this.draw.arc().startAngle(() => {
            console.log('startAngle', start)
            return this.valueToRadians(start)
        })
        .endAngle( () => {
            console.log('endAngle', value)
            return this.valueToRadians(value)
        })
        .innerRadius(this.options.raduis - this.options.barWidth)
        .outerRadius(this.options.raduis)
        return arc
    }
    drawBand(path ,start, end, color, className) {
        
        const data = {value: end}
        console.log('path', path)
        return path
            .append('svg:path')
            .attr('class', className || 'noname')
            .style('fill', color)
            .attr('d', this.getArc())
            .attr('transform', () => { return 'translate(' + this.options.cx + ', ' + this.options.cy + ') rotate(270)' });
    }

    drawDashes() {
        const { options, draw, container } = this
        const majorDelta = options.range / (options.majorTicks - 1);
        let fontSize = Math.round(options.fontSize);
        const drawDashLine = (point1, point2, color, width = options.dashWidth) => {
            container.append('svg:line')
                .attr('x1', point1.x)
                .attr('y1', point1.y)
                .attr('x2', point2.x)
                .attr('y2', point2.y)
                .style('stroke', color)
                .style('stroke-width', width);
        }
        dashes.map(major => {
            const minorDelta = majorDelta / options.minorTicks;
            // Draw small points
            for (let minor = major + minorDelta; minor < Math.min(major + majorDelta, options.max); minor += minorDelta) {
                const point1 = this.valueToPoint(minor, 0.75);
                const point2 = this.valueToPoint(minor, 0.85);
                drawDashLine(point1, point2, '#fff')

                {
                    const point1 = this.valueToPoint(minor, 0.85);
                    const point2 = this.valueToPoint(minor, 1);
                    drawDashLine(point1, point2, '#050A20', 1)
                }
            }

            // Draw big point
            const point1 = this.valueToPoint(major, 0.7);
            const point2 = this.valueToPoint(major, 0.85);
            drawDashLine(point1, point2, '#fff')
            {
                const point1 = this.valueToPoint(major, 0.85);
                const point2 = this.valueToPoint(major, 1);
                drawDashLine(point1, point2, '#050A20', 1)
            }
        })
    }
}