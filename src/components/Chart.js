import Vue from 'vue'
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins
Vue.component('line-chart', {
    extends: Line,
    mixins: [reactiveProp],
    mounted() {
        this.renderChart(this.chartData, {
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            display: true
                        },
                        type: "time",
                        time: {
                            displayFormats: {
                                quarter: 'MMM YYYY'
                            }
                        },
                        position: "bottom"
                    }
                ]
            },
            responsive: true, maintainAspectRatio: false
        })
    }
})
