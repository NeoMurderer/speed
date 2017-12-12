import Vue from 'vue'
import Vuex from 'vuex'
import Papa from 'papaparse'
import moment from 'moment'
const LIMIT = 2000
const state = {
    statistic: []
}
const getters = {
    statistic: (state, getters) => (index) => {
        let stat = state.statistic[index]
        let time = []
        if(!stat) {
            stat = {
                label: 'Loading',
                values: []
            }
        } else {
            time = state.statistic[0].values
        }
        const data = stat.values.map( (item, index) => {
            return {
                x:  moment(moment.unix(+time[index]), "HH:mm:ss"),
                y: item
            }
        })
        const chartData = {
            labels: ['January'],
            datasets: [
                {
                    label: stat.label,
                    backgroundColor: '#f87979',
                    data
                }
            ]
        }
        return chartData
    }
}
const actions = {
    loadStat({ commit }) {
        // if(localStorage.getItem('statistic')) {
        //     const data = JSON.parse(localStorage.getItem('statistic'))
        //     commit('setup', data)
        //     return
        // }
        Papa.parse("static/chart.csv", {
            download: true,
            complete: function (results) {
                const data = results.data.splice(0, LIMIT);
                commit('load', data)
            }
        });
    }
}
const mutations = {
    setup(state, data) {
        state.statistic = data
    },
    load(state, data) {
        let chartData = []
        const headers = data.splice(0, 1);
        headers[0].map((sensor, index) => {
            const values = data.map(item => item[index])
            chartData.push({
                label: sensor,
                values
            })
        })
        state.statistic = chartData
        // localStorage.setItem('statistic', JSON.stringify(chartData));
    }
}
Vue.use(Vuex)
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})