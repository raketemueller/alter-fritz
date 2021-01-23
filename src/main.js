import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

import FritzBox from './components/FritzBox.vue'
import FritzBoxLogin from './components/FritzBoxLogin.vue'
import FritzBoxDevice from './components/FritzBoxDevice.vue'
import TemperatureChart from './components/TemperatureChart.vue'

import xml2js from 'xml2js'

const xml2jsParser = new xml2js.Parser({ explicitArray: false })
axios.interceptors.response.use(res => {

    // Important: request interceptors **must** return the request.
    if (res.headers['content-type'].startsWith('text/xml')) {
        return xml2jsParser.parseStringPromise(res.data)
    }

    return res
})

const app = createApp(App)
app.config.globalProperties.$http = axios
app.component('fritz-box-login', FritzBoxLogin)
app.component('fritz-box', FritzBox)
app.component('fritz-box-device', FritzBoxDevice)
app.component('temperature-chart', TemperatureChart)

app.mount('#app')
