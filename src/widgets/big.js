export default class BigWidget {
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
            majorTicks: 10,
            minorTicks: 5,
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
                return this.size / 2
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
    }
}