<!-- eslint-disable-->
<template>
    <div>
      <b-col md="12" class="header">
        <p style="margin-top: 10px;">Power Monitoring</p>
        <img class="d-none d-sm-block" :src="require('@/assets/images/logo/logo.png')">
      </b-col>
      <b-container class="container">
        <b-row>
        <b-col md="8" offset-md="1">
          <div style="margin-bottom: 20px">
            <feather-icon icon="HomeIcon" color="#0a8de2" size="18" style="position: absolute" />
            <p style="margin-left: 20px;">
              <b-link :to="{ name: 'home' }">Home</b-link> / 
              Node List
            </p>
          </div>
          <b-card class="box">
            <b-row>
              <!-- title -->
              <h1 class="page-title">Node List</h1>
              <div class="col-md-6">
                <div style="margin-left: -10px">
                  Show
                  <v-select
                    v-model="perpage"
                    :options="option_perpage"
                    :components="{ Deselect, OpenIndicator }"
                    style="display:inline-block;min-width:90px;max-width:auto"
                    @input="loadPerpage"
                  >
                    <slot name="no-options">Sorry, no matching options.</slot>
                  </v-select>
                  entries
                </div>
              </div>
              <div class="col-md-6" style="text-align: right; padding-right:0px;">
                Search: 
                <input v-model="filter" class="form-control" style="width: 200px; display: inline-block; margin-left: 10px;" placeholder="keyword ..." />
              </div>
              <div class="col-md-12" style="height: 20px" />
              <!-- datatable -->
              <b-table striped hover
                :items="items"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perpage"
                :filter="filter"
                style="border-bottom: 1px #eee solid"
              >
                <template #cell(name)="data" aria-colspan="6" >
                  <div class="text-nowrap">
                    {{ data.item.name }}
                  </div>
                </template>

                <template #cell(description)="data" aria-colspan="6" >
                  <div class="text-nowrap">
                    {{ data.item.description === null ? 'No description' : data.item.description }}
                  </div>
                </template>

                <template #cell(api_key)="data" aria-colspan="6" >
                  <div class="text-nowrap">
                    {{ data.item.api_key }}
                  </div>
                </template>

                <template #cell(action)="data" aria-colspan="6">
                  <div class="text-nowrap">
                    <b-link class="btn btn-primary" :to="{ name: 'detail', params: { 'n_id': data.item.id, 's_id': data.item.s_id }}">View Detail</b-link>
                  </div>
                </template>

              </b-table>

              <p v-if="rows < 1" class="loading">
                Please Wait ...
              </p>

              <!-- pagination -->
              <div class="col-md-12" style="height:10px"></div>
              <div class="col-md-6">
                <p style="margin-top: 10px">Show {{first_entries}} to {{ last_entries }} of {{ items.length }} entries</p>
                <p style="margin-top: -10px">Total node : {{ items.length }}</p>
              </div>
              <b-col md="6">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  base-url="#"
                  :per-page="perpage"
                  :align="selected"
                  @change="loadPage"
                />
              </b-col>
            </b-row>
          </b-card>

        </b-col>
        <div class="col-md-2">
          <i class="node-right-icon" style="margin-top: 100%; margin-left: 30px;" />
        </div>
        </b-row>
      </b-container>
    </div>
</template>

<script>

import {
  BTable,
  BContainer,
  BCol,
  BRow,
  BCard,
  BPagination,
  BLink,
} from 'bootstrap-vue'

import axios from 'axios'
import httpApi from '@/main'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import vSelect from 'vue-select'

export default {
  components: {
    BCol,
    BRow,
    BTable,
    BContainer,
    BCard,
    FeatherIcon,
    BPagination,
    BLink,
    vSelect,
  },
  data() {
    return {
      // axios response storage
      api: [], // api storage untuk menyimpan data axios response sensor detail
      api1: [], // api storage untuk menyimpan data axios response sensor detail
      apikey: httpApi.ApiKey, // data api key

      // konfigurasi table
      option_perpage: [10, 20, 50, 100],
      Deselect: {
        render: createElement => createElement('span', ''),
      },
      OpenIndicator: {
        render: createElement => createElement('span', { class: 'dropdown-icon' }),
      },

      // table field data
      fields: [
        { key: 'id', label: 'Id', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'description', label: 'Description', sortable: true },
        { key: 'api_key', label: 'API Key', sortable: true },
        { key: 'action', label: 'Action' },
      ],

      // table value
      items: [], // item storage untuk list data pada table
      items1: [], // item storage untuk list data pada table
      first_entries: 0,
      last_entries: 0,
      filter: '',

      // pagination setting
      selected: 'right', // mengatur posisi penomoran halaman
      currentPage: 1, // halaman aktif table
      perpage: 10, // jumlah data yang ditampilkan untuk tiap halaman pada table
      rows: 0, // banyaknya data yang di tampilkan pada table
      rows1: 0, // banyaknya data yang di tampilkan pada table
      active_sensor: httpApi.sensor,
      active_node: [],
      active_sensor_id: [],
    }
  },
  created() {
    const http = axios.get(`${httpApi.host}/app/node?api_key=${httpApi.ApiKey}`, {
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
    })

    http.then(response => {
      this.api = response.data
    })

    http.finally(() => {
      const items = this.api.data
      const rows = this.api.data.length
      const dataTmp = []

      for (let x = 0; x < rows; x += 1) {
        this.is_sensor(items[x].id)
      }

      setTimeout(() => {
        for (let xx = 0; xx < rows; xx += 1) {
          for (let y = 0; y < this.active_node.length; y += 1) {
            if (items[xx].id === this.active_node[y]) {
              items[xx].s_id = this.active_sensor_id[y]
              dataTmp.push(items[xx])
            }
          }
        }

        this.items = dataTmp
        this.rows = this.items.length
        this.updateState()
      }, 1000)
      // entries calculation
    })
  },
  methods: {
    is_sensor(nId) {
      const http = axios.get(`${httpApi.host}/sensor?node_id=${nId}`, {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })

      http.then(response => {
        this.api1 = response.data
      })

      http.finally(() => {
        this.items1 = this.api1.data
        this.rows1 = this.api1.data.length

        for (let x = 0; x < this.rows1; x += 1) {
          if (this.items1[x].name === this.active_sensor) {
            this.active_node.push(this.items1[x].node_id)
            this.active_sensor_id.push(this.items1[x].id)
          }
        }
      })
    },
    // change trigger for data perpage display
    loadPerpage(page) {
      this.perpage = page
      this.currentPage = 1
      this.first_entries = 1
      this.updateState()
    },
    // change trigger for pagination data
    loadPage(page) {
      this.currentPage = page
      this.first_entries = 1
      this.updateState()
    },
    // update entrie state
    updateState() {
      const pageTotal = Math.floor((this.items.length / this.perpage))
      this.last_entries = this.perpage * this.currentPage
      if (this.currentPage === (pageTotal + 1)) {
        this.last_entries = this.items.length
      }
      this.first_entries = ((this.currentPage - 1) * this.perpage) + 1
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
