<!-- eslint-disable-->
<template>
    <div v-if="this.api !== false" class="container">
      <div class="row">
        <div class="col-md-2 sidebar">
          <div style="text-align: center;padding-top: 20px">
            <img :src="require('@/assets/images/logo/logo.png')" style="width: 150px;">
          </div>
          <div class="list">
            <b-link :to="{ name: 'detail', params: { 'n_id': this.$route.params.n_id, 's_id': this.$route.params.s_id }}" class="side-menu">
              <feather-icon icon="AirplayIcon" size="25" style="position: relative; top: -1px" />
              <span style="margin-left: 15px">Dashboard</span>
            </b-link>
            <b-link :to="{ name: 'setting', params: { 'n_id': this.$route.params.n_id, 's_id': this.$route.params.s_id }}" class="side-menu">
              <feather-icon icon="SettingsIcon" size="25" style="position: relative; top: -1px" />
              <span style="margin-left: 15px">Settings</span>
            </b-link>
          </div>
        </div>
        <div class="col-md-10 navbar">
          {{ this.nodeName}} : {{ this.api.data.name }}
          <div style="font-size: 15px; position: relative">
            <p style="margin: 0px">{{ username }}</p>
            <p style="margin: 0 0 0 -4px; font-size: 12px"><b-link @click="logout">Logout</b-link></p>
            <img :src="avatar" style="width: 40px; height: 40px; border-radius: 100%; margin-left: 10px;position: absolute; top: 2px; left: -60px" />
          </div>
        </div>
        <div class="col-md-12" style="height: 60px;" />
        <div class="col-md-2" />
        <div class="col-md-10" style="padding-left: 40px">
          <div class="row">
            
            <div class="col-md-12">
              <div style="margin-bottom: 20px;">
                <feather-icon icon="HomeIcon" color="#0a8de2" size="18" style="position: absolute" />
                <p style="margin-left: 20px;">
                  <b-link :to="{ name: 'home' }">Home</b-link> / 
                  <b-link :to="{ name: 'node' }">Node List</b-link> / 
                  Sensor List
                </p>
              </div>
            </div>

            <div class="col-md-5">
              <b-card style="border-left: 8px #0a8de2 solid; height: 160px">
                <p style="color: #0a8de2">Date Filter :</p>
                <flat-pickr v-model="startDate" class="form-control" :config="{ enableTime: true,dateFormat: 'Y-m-d H:i'}" style="width: 45%; display: inline-block; background: #f5f5f5" /> Until 
                <flat-pickr v-model="endDate" class="form-control" :config="{ enableTime: true,dateFormat: 'Y-m-d H:i'}" style="width: 45%; display: inline-block; background: #f5f5f5" />
                <button style="float: right; margin-top: 10px; margin-right: 5px" class="btn btn-primary" @click="dateFilterChart">Filter</button>
              </b-card>
            </div>
            
            <div class="col-md-3">
              <b-card style="border-left: 8px #09e1a8 solid; height: 160px">
                <p style="color:#09e1a8">Usage (KWh) :</p>
                <p style="font-size: 25px; margin-top: 20px">20,0227 KWh</p>
              </b-card>
            </div>

            <div class="col-md-3">
              <b-card style="border-left: 8px #ff8a00 solid; height: 160px">
                <p style="color:#ff8a00">Total :</p>
                <p style="font-size: 25px; margin-top: 20px">Rp 28.912,00</p>
              </b-card>
            </div>
            
            <div class="col-md-11">
              <p style="color:#0a8de2;font-size: 25px;margin-bottom: 40px; border-top: 1px #666 solid;padding-top: 30px; margin-top: 10px">Real-Time Chart</p>
              <b-card>
                <div class="chart-label" style="margin-left: -10px">
                  <p class="y">Energy Usage (KWh)</p>
                  <p class="x">Date Series</p>
                  <div class="col-md-12" style="padding-left: 50px">
                      <app-echart-line :option-data="chart2" />
                  </div>
                </div>
              </b-card>
            </div>

            <div class="col-md-11">
              <p style="color:#0a8de2;font-size: 25px;margin-bottom: 40px; border-top: 1px #666 solid;padding-top: 30px; margin-top: 10px">Range Chart</p>
              <b-card>
                <div class="chart-label" style="margin-left: -10px">
                  <p class="y">Energy Usage (KWh)</p>
                  <p class="x">Date Series</p>
                  <div class="col-md-12" style="padding-left: 50px">
                      <app-echart-line :option-data="chart" />
                  </div>
                </div>
              </b-card>
            </div>

            <div class="col-md-11">
              <p style="color:#0a8de2;font-size: 25px;margin-bottom: 40px; border-top: 1px #666 solid;padding-top: 30px; margin-top: 10px">Table Data</p>
              <b-card>
                <b-row>
                  <!-- filter table as status -->
                  <div class="col-md-6">
                    Show
                    <v-select
                      v-model="perpage"
                      :options="option_perpage"
                      :components="{ Deselect, OpenIndicator }"
                      @change="loadPerpage"
                      style="display:inline-block;min-width:90px;max-width:auto"
                    >
                      <slot name="no-options">Sorry, no matching options.</slot>
                    </v-select>
                    entries
                  </div>
                  <!-- filter table as date range -->
                  <div class="col-md-6">
                    <p style="text-align: right">
                      Sort By :
                      <b-badge style="margin: 5px" variant="success" @click="status('up')">Up Status</b-badge>
                      <b-badge style="margin: 5px" variant="danger" @click="status('down')">Down Status</b-badge>
                      <b-badge style="margin: 5px" variant="secondary" @click="status('all')">All</b-badge>
                    </p>
                  </div>
                  <div class="col-md-12">
                    <div class="row">
                      <b-table striped hover :items="items1" :fields="fields" :current-page="currentPage" :per-page="perpage" style="margin-top: 20px">
                        <template #cell(sensor_status)="data" aria-colspan="6" >
                          <div class="text-nowrap">
                            <p>
                              <b-badge v-if="data.item.sensor_status === 'down'" class="badges" variant="danger">Down</b-badge>
                              <b-badge v-if="data.item.sensor_status !== 'down'" class="badges" variant="success">Up</b-badge>
                            </p>
                          </div>
                        </template>

                        <template #cell(value)="data" aria-colspan="6" >
                          <div v-if="data !== false" class="text-nowrap">
                            <p>{{ data.item.value === null ? '0.00000' : data.item.value }}</p>
                          </div>
                        </template>

                      </b-table>

                      <!-- trigger result for 404 data -->
                      <p v-if="rows1 < 1" class="loading">
                        Please Wait ...
                      </p>

                      <!-- pagination -->
                      <div class="col-md-12" style="height:10px"></div>
                      <div class="col-md-6">
                        <p style="margin-top: 10px">Show {{first_entries}} to {{ last_entries }} of {{ items1.length }} entries</p>
                        <p style="margin-top: -10px">Total data : {{ items1.length }}</p>
                      </div>
                      <div class="col-md-6">
                        <b-pagination
                          v-model="currentPage"
                          :total-rows="items1.length"
                          base-url="#"
                          :per-page="perpage"
                          :align="selected"
                          @change="loadPage"
                        />
                      </div>
                    </div>
                  </div>
                </b-row>
              </b-card>
            </div>

          </div>
        </div>
      </div>
    </div>
</template>

<script>

import {
  BTable, BRow, BPagination, BBadge, BLink, BCard,
} from 'bootstrap-vue'
import axios from 'axios'
import httpApi from '@/main'
import AppEchartLine from '@core/components/charts/echart/AppEchartLine.vue'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import flatPickr from 'vue-flatpickr-component'
import vSelect from 'vue-select'

export default {
  components: {
    BRow,
    BTable,
    FeatherIcon,
    BPagination,
    BBadge,
    BLink,
    AppEchartLine,
    flatPickr,
    BCard,
    vSelect,
  },
  data() {
    return {
      // menyimpan data tanggal mulai dan akhir filter pada chart
      startDate: '',
      endDate: '',
      timediff: '',

      // pengaturan pilihan filter berdasarkan jam / menit untuk range waktu 1 hari
      advance: false,
      lowshorting: 'Hours', // Hours or Minute

      // menyimpan data tanggal mulai dan akhir filter pada table
      TStartDate: '',
      TEndDate: '',
      TTimediff: '',

      // axios response storage
      apikey: httpApi.ApiKey, // data api key
      api: false, // api storage untuk menyimpan data axios response sensor detail
      lastSensor: false, // api storage untuk menyimpan data axios response last sensor

      // vue select conf
      option_perpage: [10, 20, 50, 100],
      Deselect: {
        render: createElement => createElement('span', ''),
      },
      OpenIndicator: {
        render: createElement => createElement('span', { class: 'dropdown-icon' }),
      },

      // chart data
      chart: {
        xAxisData: [], // Horizontal Data or Chart X Curva Label
        series: [], // Vertical Data or Chart Y Curva Label
        interval: 0, // jeda waktu menampilkan label
      },
      // chart data
      chart2: {
        xAxisData: [], // Horizontal Data or Chart X Curva Label
        series: [], // Vertical Data or Chart Y Curva Label
        interval: 0, // jeda waktu menampilkan label
      },
      chart_types: null,
      cStorage: false, // menyimpan data chart hasil filtering

      // table field data
      // paramater key untuk meregister nama index data
      // paramater label untuk membuat custom name untuk field title
      // sortable menampilkan tombol automatic sorting pada table field title
      fields: [
        {
          key: 'no',
          label: 'No',
          sortable: true,
        },
        {
          key: 'created_at',
          label: 'Update Time',
          sortable: true,
        },
        {
          key: 'value',
          label: 'Value',
          sortable: true,
        },
        {
          key: 'sensor_status',
          label: 'status',
        },
      ],

      // table value
      items: [], // item storage untuk list data pada chart
      items1: [], // item storage untuk list data pada table
      items2: [], // item storage untuk list data pada chart
      times: [],
      first_entries: 0,
      last_entries: 0,

      // pagination setting
      selected: 'right', // mengatur posisi penomoran halaman
      currentPage: 1, // halaman aktif table
      perpage: 10, // jumlah data yang ditampilkan untuk tiap halaman pada table
      rows: 0, // banyaknya data yang di tampilkan pada chart
      rows1: 0, // banyaknya data yang di tampilkan pada table
      rows2: 0, // banyaknya data yang di tampilkan pada chart
      nodeName: '',
      username: sessionStorage.getItem('name'),
      avatar: sessionStorage.getItem('avatar'),
    }
  },
  created() {
    // data render
    this.render()
    // HTTP AXIOS REQUEST
    const http = axios.get(`${httpApi.host}/sensor/${this.$route.params.s_id}`, {
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
    })

    // axios response
    http.then(response => {
      this.api = response.data
    })

    // axios finish data render
    http.finally(() => {
      this.graph_data()
      this.graph_data_realtime()
      this.table_sensor() // call table data
      this.node_name()
    })
  },

  methods: {
    node_name() {
      const http = axios.get(`${httpApi.host}/app/node/${this.$route.params.n_id}?api_key=${httpApi.ApiKey}`, {
        headers: { Authorization: sessionStorage.getItem('token') },
      })

      http.then(response => { this.nodeName = response.data.data })

      http.finally(() => {
        this.nodeName = this.nodeName.name
      })
    },
    // melakukan permintaan data untuk menampilkan data pada table
    table_sensor() {
      // query param
      const Start = this.TStartDate.split(' ')
      const End = this.TEndDate.split(' ')
      let param = `start_date=${Start[0]}&`
      param += `start_time=${encodeURIComponent(Start[1])}&`
      param += `end_date=${End[0]}&`
      param += `end_time=${encodeURIComponent(End[1])}&`
      param += 'type=table'

      // axios request
      const http = axios.get(`${httpApi.host}/app/data/sensor/${this.$route.params.s_id}?api_key=${httpApi.ApiKey}&${param}`, {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })

      // axios response
      http.then(response => {
        const { data } = response.data.data
        this.times = response.data.data
        // console.log(data)
        const limit = data
        limit.reverse()
        this.items1 = limit
        this.rows1 = this.items1.length
        const status = sessionStorage.getItem('table_status')
        const filter = status === null ? null : status
        const recap = []
        let number = 0

        for (let z = 0; z < this.rows1; z += 1) {
          const toGMT = (this.strToTime(this.items1[z].created_at) + (3600 * 7)) * 1000
          let timeconvert = new Date(toGMT)
          timeconvert = timeconvert.toISOString()
          this.items1[z].value = this.items1[z].value === null ? '0.0000' : this.items1[z].value
          this.items1[z].created_at = timeconvert
        }

        // fix invalid date range data
        if (filter !== null) {
          for (let x = 0; x < this.rows1; x += 1) {
            let datesource = this.items1[x].created_at
            datesource = datesource.split('T')
            const getdate = datesource[0]
            const timesource = datesource[1].split('.')
            const gettime = timesource[0]

            // convert date string ke timestamp
            const SD = Date.parse(`${this.TStartDate}`) / 1000
            const ED = Date.parse(`${this.TEndDate}`) / 1000
            const TS = Date.parse(getdate) / 1000
            const TLIM = parseInt((Date.now() / 1000), 10)
            const TNOW = this.strToTime(this.items1[x].created_at) - (3600 * 7)
            // memilihan batasan durasi filter
            if (TS > SD && TS <= ED && TNOW <= TLIM) {
              if (this.items1[x].sensor_status === filter || filter === 'all') {
                number += 1
                this.items1[x].no = number
                this.items1[x].created_at = `${this.dateConvert(getdate, 1)}. ${this.timeConvert(gettime, 1)}`
                recap.push(this.items1[x])
              }
            }
          }

          // renew data yanng telah di olah
          this.items1 = recap
          this.rows1 = recap.length
          this.updateState()
        }
      })
    },

    // mendapatkan data untuk di tampilkan pada chart
    graph_data() {
      // query param
      const Start = this.startDate.split(' ')
      const End = this.endDate.split(' ')
      let param = `start_date=${Start[0]}&`
      param += `start_time=${encodeURIComponent(Start[1])}&`
      param += `end_date=${End[0]}&`
      param += `end_time=${encodeURIComponent(End[1])}&`
      param += 'type=table'
      // axios request
      const http = axios.get(`${httpApi.host}/app/data/sensor/${this.$route.params.s_id}?api_key=${httpApi.ApiKey}&${param}`, {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })

      // axios response
      http.then(response => {
        if (typeof response.data.data === 'undefined') {
          // if the start date exceeds the end date
          this.$fire({
            title: 'Internal Server Error',
            text: 'Please reset the date range or contact administrator.',
            type: 'error',
            timer: 6000,
          })
        } else {
          // if the date is valid
          const { data } = response.data.data
          const limit = data
          // console.log(limit)
          limit.reverse()
          this.items = limit
          this.rows = this.items.length

          for (let z = 0; z < this.rows; z += 1) {
            const toGMT = (this.strToTime(this.items[z].created_at) + (3600 * 7)) * 1000
            let timeconvert = new Date(toGMT)
            timeconvert = timeconvert.toISOString()
            this.items[z].created_at = timeconvert
          }

          let buildData = []

          // pemilihan jenis agregasi data
          if (this.timediff >= 3600 && this.timediff < (86400 * 7)) {
            // display 1 - 2 days
            if (this.timediff < 86400) {
              if (this.lowshorting === 'Hours') {
                // per hours
                buildData = this.displayHour()
              } else {
                // per minuter
                buildData = this.displayMinutes()
              }
            } else {
              buildData = this.displayHour()
            }
          } else if (this.timediff >= (86400 * 7) && this.timediff < (2629744 * 3)) {
            // display 3 days until 1 month
            buildData = this.displayDay()
          } else if (this.timediff >= (2629744 * 3)) {
            // display bettter than 3 months
            buildData = this.displayMonth()
          }
          this.cStorage = buildData
        }

        // checkpoint debugging
        // console.log(this.cStorage)

        // axios finish data render
        http.finally(() => {
          // menyimpan data ke chart filter storage
          for (let x = 0; x < this.cStorage.length; x += 1) {
            if (x === 0) {
              this.chart.xAxisData.push('')
              this.chart.series.push(`${this.cStorage[x][1]}`)
            }
            this.chart.xAxisData.push(`${this.cStorage[x][0]}`)
            this.chart.series.push(`${this.cStorage[x][1]}`)
          }
        })
      })
    },
    // mendapatkan data untuk di tampilkan pada chart realtime
    graph_data_realtime(num = false) {
      // query param
      let param = `start_date=${this.getTime()}&`
      param += 'start_time=00%3A00%3A01&'
      param += `end_date=${this.getTime()}&`
      param += 'end_time=23%3A59%3A59&'
      param += 'type=graph&'
      // param += 'realtime=true'

      // axios request
      const http = axios.get(`${httpApi.host}/app/data/sensor/${this.$route.params.s_id}?api_key=${httpApi.ApiKey}&${param}`, {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })

      // axios response
      http.then(response => {
        // if the date is valid
        const { data } = response.data.data
        const limit = data
        this.items2 = limit
        this.rows2 = this.items.length
        // axios finish data render
        http.finally(() => {
          console.log(this.items2)
          // menyimpan data ke chart filter storage
          for (let x = 0; x < limit.value.length; x += 1) {
            if (num === false) {
              if (Date.parse(limit.created_at[x]) <= Date.now()) {
                let timeStamp = limit.created_at[x].split(' ')
                timeStamp = this.timeConvert(timeStamp[1], 1)
                limit.value[x] = limit.value[x] === null ? 0.000 : limit.value[x]
                if (x === 0) {
                  this.chart2.xAxisData.push('')
                  this.chart2.series.push(`${limit.value[x]}`)
                }
                this.chart2.xAxisData.push(`${timeStamp}`)
                this.chart2.series.push(`${limit.value[x]}`)
                sessionStorage.setItem('last_number', x)
              }
            }
          }

          const index = parseInt(sessionStorage.getItem('last_number'), 10)

          if ((limit.value[index + 1] !== null) && (Date.parse(limit.created_at[index + 1]) <= Date.now())) {
            sessionStorage.setItem('last_number', (index + 1))
            let timeStamp = limit.created_at[(index + 1)].split(' ')
            timeStamp = this.timeConvert(timeStamp[1], 1)
            this.chart2.xAxisData.push(`${timeStamp}`)
            this.chart2.series.push(`${limit.value[(index + 1)]}`)
            console.log('update')
          } else {
            console.log('keep')
          }

          setTimeout(() => this.graph_data_realtime(true), 5000)
        })
      })
    },

    // filter display as per hours
    displayMinutes() {
      const timeseries = []
      const databundle = []
      for (let x = 0; x < this.rows; x += 1) {
        let maindata = this.items[x].created_at

        // get date
        maindata = maindata.split('T')
        const getdate = maindata[0]

        // get time
        maindata = maindata[1].split('.')
        const gettime = this.timeConvert(maindata[0], 1)

        // get value
        const getvals = this.items[x].value

        // set limit time
        const TLIM = parseInt((Date.now() / 1000), 10)
        const TNOW = this.strToTime(this.items[x].created_at) - (3600 * 7)

        // databundle
        if (this.strToTime(getdate) >= this.strToTime(this.startDate) && this.strToTime(getdate) <= this.strToTime(this.endDate) && TNOW <= TLIM) {
          databundle.push([`${gettime}`, getvals])
          timeseries.push(`${gettime}`)
        }
      }

      const TS = [...new Set(timeseries)]
      databundle.reverse()
      TS.reverse()
      const DB = this.multiDimensionalUnique(databundle, TS)
      return DB
    },

    // filter display as per hours
    displayHour() {
      const timeseries = []
      const databundle = []
      for (let x = 0; x < this.rows; x += 1) {
        let maindata = this.items[x].created_at

        // get date
        maindata = maindata.split('T')
        const getdate = maindata[0]
        const datelabel = this.dateConvert(getdate, 0)

        // get time
        maindata = maindata[1].split('.')
        maindata = maindata[0].split(':')
        const gettime = this.timeConvert(`${maindata[0]}:${maindata[1]}:00`)

        // get value
        const getvals = this.items[x].value

        // set limit time
        const TLIM = parseInt((Date.now() / 1000), 10)
        const TNOW = this.strToTime(this.items[x].created_at) - (3600 * 7)

        // databundle
        if (this.strToTime(getdate) >= this.strToTime(this.startDate) && this.strToTime(getdate) <= this.strToTime(this.endDate) && TNOW <= TLIM) {
          databundle.push([`${datelabel} ${gettime}`, getvals])
          timeseries.push(`${datelabel} ${gettime}`)
        }
      }

      const TS = [...new Set(timeseries)]
      databundle.reverse()
      TS.reverse()
      const DB = this.multiDimensionalUnique(databundle, TS)
      return DB
    },

    // filter display as per days
    displayDay() {
      const timeseries = []
      const databundle = []
      for (let x = 0; x < this.rows; x += 1) {
        let maindata = this.items[x].created_at

        // get date
        maindata = maindata.split('T')
        const getdate = maindata[0]
        const datelabel = this.dateConvert(getdate, 1)

        // get value
        const getvals = this.items[x].value

        // set limit time
        const TLIM = parseInt((Date.now() / 1000), 10)
        const TNOW = this.strToTime(this.items[x].created_at) - (3600 * 7)

        // databundle
        if (this.strToTime(getdate) >= this.strToTime(this.startDate) && this.strToTime(getdate) <= this.strToTime(this.endDate) && TNOW <= TLIM) {
          databundle.push([`${datelabel}`, getvals])
          timeseries.push(`${datelabel}`)
        }
      }

      const TS = [...new Set(timeseries)]
      databundle.reverse()
      TS.reverse()
      const DB = this.multiDimensionalUnique(databundle, TS)
      return DB
    },

    // filter display as per days
    displayMonth() {
      const timeseries = []
      const databundle = []
      for (let x = 0; x < this.rows; x += 1) {
        let maindata = this.items[x].created_at

        // get date
        maindata = maindata.split('T')
        maindata = maindata.split('-')
        const getdate = `${maindata[0]}-${maindata[1]}`

        // get value
        const getvals = this.items[x].value

        // set limit time
        const TLIM = parseInt((Date.now() / 1000), 10)
        const TNOW = this.strToTime(this.items[x].created_at) - (3600 * 7)

        // databundle
        if (this.strToTime(getdate) >= this.strToTime(this.startDate) && this.strToTime(getdate) <= this.strToTime(this.endDate) && TNOW <= TLIM) {
          databundle.push([`${getdate}`, getvals])
          timeseries.push(`${getdate}`)
        }
      }

      const TS = [...new Set(timeseries)]
      databundle.reverse()
      TS.reverse()
      const DB = this.multiDimensionalUnique(databundle, TS)
      return DB
    },
    render() {
      this.chart.series = []
      this.chart.xAxisData = []
      // menset data durasi tanggal yang di simpan pada session storage ke dalam local storage untuk chart
      if (sessionStorage.getItem('date_start') !== null) {
        // Jika durasi tanggal sudah pernah di set
        this.startDate = sessionStorage.getItem('date_start') // tanggal mulai
        this.endDate = sessionStorage.getItem('date_end') // tanggal akhir
        this.timediff = sessionStorage.getItem('timediff') // selisih waktu antara tanggal mulai dan tanggal akhir
        this.TStartDate = this.startDate // tanggal mulai
        this.TEndDate = this.endDate // tanggal akhir
        this.TTimediff = this.timediff // selisih waktu antara tanggal mulai dengan tanggal akhir
      } else {
        // Durasi tanggal bawaan jika tidak di set
        this.startDate = `${this.getTime(1)} 00:00:01` // tanggal mulai
        this.endDate = `${this.getTime()} 23:59:59`// tanggal akhir
        this.timediff = this.strToTime(this.endDate) - this.strToTime(this.startDate) // selisih waktu antara tanggal mulai dengan tanggal akhir
        this.TStartDate = this.startDate // tanggal mulai
        this.TEndDate = this.endDate // tanggal akhir
        this.TTimediff = this.timediff // selisih waktu tetap ( satuan detik untuk 1 jam )
      }

      // pengaturan jenis chart
      this.chart_types = sessionStorage.getItem('chart_types') === null ? 'Range' : sessionStorage.getItem('chart_types')

      // pengaturan interval label data yang akan di tampilkan apda chart
      if (sessionStorage.getItem('lowshorting') !== null) {
        this.lowshorting = sessionStorage.getItem('lowshorting')
        if (this.chart_types === 'Real-Time') {
          // untuk data realtime
          this.chart.interval = 0
        } else if (this.timediff <= 86400) {
          // jika durasi filter data dalam kurun waktu 24 jam
          this.chart.interval = this.lowshorting === 'Minutes' ? 0 : 0
        } else if (this.timediff > 86400 && this.timediff <= (86400 * 2)) {
          // Jika durasi data yang di filter dalam kurun waktu 1 - 2 hari
          this.chart.interval = 3
        } else if (this.timediff > (86400 * 2) && this.timediff <= (86400 * 4)) {
          // jika durasi data yang di filter dalam kurun waktu 2 - 4 hari
          this.chart.interval = 5
        } else if (this.timediff > (86400 * 4) && this.timediff <= (86400 * 7)) {
          // jika durasi data yang di filter dalam kurun waktu 4 - 7 hari
          this.chart.interval = 10
        } else if (this.timediff > (86400 * 7)) {
          // Jika durasi data yang di filter melebihi 7 hari
          this.chart.interval = 1
        }
      }

      // data untuk persortingan table berdasarkan sensor status dari data
      // ex : Up / Down
      if (sessionStorage.getItem('table_status') === null) {
        sessionStorage.setItem('table_status', 'all')
      }

      // menampilkan advance input field untuk pemfilteran data berdasarkan satuan jam / menit
      // field ini hanya akan di tampilkan jika tanggal mulai dan berakhir memiliki kesamaan data
      if (this.startDate === this.endDate) {
        this.advance = true
      }
    },
    // date filter chart submit
    dateFilterChart() {
      const timestamp1 = Date.parse(`${this.startDate}`) / 1000
      const timestamp2 = Date.parse(`${this.endDate}`) / 1000
      const calcstamps = timestamp2 - timestamp1

      if (timestamp1 > timestamp2 || (timestamp2 - timestamp1) < (3600 * 17)) {
        this.$fire({
          title: 'Invalid date range !!!',
          text: 'start date exceeds the end date',
          type: 'error',
          timer: 6000,
        })
      } else {
        sessionStorage.setItem('date_start', this.startDate)
        sessionStorage.setItem('date_end', this.endDate)
        sessionStorage.setItem('timediff', calcstamps)
        sessionStorage.setItem('lowshorting', this.lowshorting)
        sessionStorage.setItem('chart_types', 'Range')
        this.render()
        setTimeout(() => {
          this.graph_data()
          this.table_sensor()
        }, 500)
      }
    },

    updateState() {
      const pageTotal = Math.floor((this.items1.length / this.perpage))
      this.last_entries = this.perpage * this.currentPage
      if (this.currentPage === (pageTotal + 1)) {
        this.last_entries = this.items1.length
      }
      this.first_entries = ((this.currentPage - 1) * this.perpage) + 1
    },
    loadPage(page) {
      this.currentPage = page
      this.first_entries = 1
      this.updateState()
    },
    // change trigger for data perpage display
    loadPerpage(page) {
      this.perpage = page
      this.currentPage = 1
      this.first_entries = 1
      this.updateState()
    },

    // table sorting as status
    status(data) {
      sessionStorage.setItem('table_status', data)
      this.table_sensor()
    },

    // str to time
    strToTime(data) {
      return (Date.parse(data) / 1000)
    },

    // get current time
    getTime(type = 0) {
      const today = new Date()
      let dd = '01'
      if (type === 1) {
        dd = '01'
      } else {
        dd = String(today.getDate()).padStart(2, '0')
      }
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()
      return `${yyyy}-${mm}-${dd}`
    },

    // array dulicate data remover
    multiDimensionalUnique(arr, ts) {
      const uniques = []
      const itemsFound = {}
      const result = []
      for (let i = 0, l = arr.length; i < l; i += 1) {
        const stringified = JSON.stringify(arr[i])
        if (!itemsFound[stringified]) {
          uniques.push(arr[i])
          itemsFound[stringified] = true
        }
      }
      for (let x = 0; x < uniques.length; x += 1) {
        if (uniques[x][1] === null) {
          const data = 0
          result.push([uniques[x][0], data])
        } else {
          const data = parseFloat(uniques[x][1], 10)
          result.push([uniques[x][0], data])
        }
      }

      let total = 0
      let accul = 0
      const rs = []
      for (let x = 0; x < ts.length; x += 1) {
        for (let y = 0; y < result.length; y += 1) {
          if (ts[x] === result[y][0]) {
            if (result[y][1] > 0) {
              accul += result[y][1]
              total += 1
            }
          }
        }
        let avg = 0
        if (accul > 0) {
          avg = accul / total
        } else {
          avg = accul
        }
        rs.push([ts[x], avg.toFixed(2)])
        if (accul > 0) {
          accul = 0
          total = 0
        }
      }
      return rs
    },

    // time convert from 24 H Format to 12 H Format
    timeConvert(time, type = 0) {
      let timeString = time
      const H = +timeString.substr(0, 2)
      const h = (H % 12) || 12
      const ampm = H < 12 ? 'AM' : 'PM'
      if (type === 1) {
        timeString = `${h + timeString.substr(2, 3)} ${ampm}`
      } else {
        timeString = `${h + timeString.substr(0, 0)} ${ampm}`
      }
      return timeString
    },

    // konversi tanggal dari penomoran jadi penamaan
    dateConvert(data, type = 0) {
      const datename = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
      const datesplit = data.split('-')

      let month = ''
      if (type > 0) {
        month = `${datename[(parseInt(datesplit[1], 10) - 1)]} ${datesplit[2]}, ${datesplit[0]}`
      } else {
        month = `${datename[(parseInt(datesplit[1], 10) - 1)]} ${datesplit[2]}, `
      }
      return month
    },
    logout() {
      sessionStorage.clear()
      this.$router.push({ name: 'home' })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
@import '@core/scss/vue/libs/vue-select.scss';
@import '@/assets/scss/detail.scss';
</style>
