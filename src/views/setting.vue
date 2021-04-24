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
                  Setting
                </p>
              </div>
            </div>
            <div class="col-md-12">
              <b-card>
                <p style="color: #0a8de2">Rate / KWh</p>
                <b-input-group>
                  <b-input-group-prepend is-text>
                    Rp
                  </b-input-group-prepend>
                  <b-form-input placeholder="Search" />
                </b-input-group>
                <div style="text-align: right; margin-top: 20px">
                  <button class="btn btn-primary">Save</button>
                </div>
              </b-card>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

import {
  BLink, BCard, BFormInput, BInputGroup, BInputGroupPrepend,
} from 'bootstrap-vue'
import axios from 'axios'
import httpApi from '@/main'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'

export default {
  components: {
    FeatherIcon,
    BLink,
    BCard,
    BFormInput,
    BInputGroup,
    BInputGroupPrepend,
  },
  data() {
    return {
      apikey: httpApi.ApiKey,
      api: false,
      nodeName: '',
      username: sessionStorage.getItem('name'),
      avatar: sessionStorage.getItem('avatar'),
    }
  },
  created() {
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
