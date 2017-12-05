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
    radianToPoint(radian, factor) {
        const options = this.options
        return {
            x: options.cx - options.raduis * factor * Math.cos(radian),
            y: options.cy - options.raduis * factor * Math.sin(radian)
        }
    }
    constructor(draw, options = {}) {
        this.options = {
            el: '#widget',
            min: 0,
            max: 280,
            majorTicks: 8,
            minorTicks: 4,
            get size() {
                return document.querySelector(this.el).offsetWidth
            },
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
        this.drawPointer(this.options.min)
        const mainBar = this.drawBand(this.container, 0, this.options.min, '#1784F9', 'mainBar')



        const max = 120;
        const min = 50;
        const speed = 120
        let side = +1;
        let i = min;
        const next = () => {
        if (i == max || i == min - 1) side *= -1;
        return (i += 1 * side);
        };
        setInterval(() => {
            const rand = next();
            this.redraw(rand, speed);
          }, speed);
    }
    drawCircle() {
        const options = this.options
        let container = this.draw.select(options.el)
            .append('svg')
            .attr('class', 'gauge')
            .attr('width', options.size)
            .attr('height', options.size)

        container = container.append("svg:g").attr("class", "pointerContainer");
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
        // if(this.prevValue - value > 10) {
        //     speed = 0
        // }
        this.container.select('.mainBar').transition().duration(speed).attr("d", this.getArc(0, value))
        this.container.select('text.valueText').text(value)

        
        const pointer = (point1, point2, point3, color) => {
            const angle = this.draw.symbol().type({
                draw: function (context) {
                    context.moveTo(point1.x, point1.y);
                    context.lineTo(point1.x, point1.y);
                    context.lineTo(point2.x, point2.y);
                    context.lineTo(point3.x, point3.y);
                    context.closePath();
                }
            })
           
        }
        // const radianValue = (this.valueToDegrees(value) - 8) * Math.PI / 180
        // const point2 = this.radianToPoint(radianValue, 0.2)
        const point1 = this.valueToPoint(value, 0.2)
        const point2 = this.valueToPoint(value, 0.85)
        this.container.select('.pointer').transition().duration(speed)
            .attr('x1', point1.x)
            .attr('y1', point1.y)
            .attr('x2', point2.x)
            .attr('y2', point2.y)
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
            .attr('x', function () { return options.cx - this.getBBox().width / 2 })
            .attr('y', function () { return options.cy - this.getBBox().height / 2 })
            .attr('class', 'valueText')
            .attr('text-anchor', 'middle')
            .text(options.min)
            .style('font-size', fontSize + 'px')
            .style('fill', '#fff')

    }
    getArc(start, value) {
        const arc = this.draw.arc().startAngle(() => {
            // console.log('startAngle', start)
            return this.valueToRadians(start)
        })
            .endAngle(() => {
                // console.log('endAngle', value)
                return this.valueToRadians(value)
            })
            .innerRadius(this.options.raduis - this.options.barWidth)
            .outerRadius(this.options.raduis)
        return arc
    }
    drawBand(path, start, end, color, className) {

        return path
            .append('svg:path')
            .attr('class', className || 'noname')
            .style('fill', color)
            .attr('d', this.getArc(start, end))
            .attr('transform', () => { return 'translate(' + this.options.cx + ', ' + this.options.cy + ') rotate(270)' });
    }

    drawDashes() {
        const { options, draw, container } = this
        const majorDelta = options.range / (options.majorTicks - 1);
        let fontSize = Math.round(options.fontSize);
        const   drawDashLine = (point1, point2, color, width = options.dashWidth) => {
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
    drawPointer(value) {
        const { options, draw, container } = this
        // needle.reset()
        // needle.moveTo(x11.toFloat(), y11.toFloat())
        // needle.lineTo(x11.toFloat(), y11.toFloat())
        // needle.lineTo((width / 2 - Math.sin(Math.toRadians((angle + 45).toDouble())) * innerCircleRadius).toFloat(), (height / 2 + Math.cos(Math.toRadians((angle + 45).toDouble())) * innerCircleRadius).toFloat())
        // needle.lineTo((width / 2 - Math.sin(Math.toRadians(angle + 45 - NEEDLE_ANGLE)) * circleRadius).toFloat(), (height / 2 + Math.cos(Math.toRadians(angle + 45 - NEEDLE_ANGLE)) * circleRadius).toFloat())
        // needle.close()
        // c.drawPath(needle, needlePaint)
        const pointer = (point1, point2, point3, color) => {
            
            const angle = this.draw.symbol().line({
                draw: function (context) {
                    context.moveTo(point1.x, point1.y);
                    console.log(point1)
                    console.log(point2)
                    console.log(point3)
                    context.lineTo(point1.x, point1.y);
                    context.lineTo(point2.x, point2.y);
                    context.lineTo(point3.x, point3.y);
                    context.closePath();
                }
            })
        }
        // this.valueToDegrees(value)
        // const point3 = this.valueToPoint(value, 0.85)
        // pointer(point1, point2, point3, 'red')

        const point1 = this.valueToPoint(value, 0.2)
        const point2 = this.valueToPoint(value, 0.85)
        container.append('svg:line')
            .attr('x1', point1.x)
            .attr('y1', point1.y)
            .attr('x2', point2.x)
            .attr('y2', point2.y)
            .attr('class', 'pointer')
            .style('stroke', "#ffffff")
            .style('stroke-width', 1);
    }
}