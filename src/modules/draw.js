import * as d3 from 'd3'

export default class Draw {
    constructor () {
        console.log('Init draw')
        return this
    }
    install (Vue, options) {
        Vue.prototype.$draw = d3
    }
    
}
