import { Route } from 'vue-router'
import Vue from 'vue'
import rootStore from '@vue-storefront/core/store'

export async function beforeEach (to: Route, from: Route, next: any) {
    const isServer = Vue.prototype.$isServer
    if ('__sso' in to.query && '__sst' in to.query && !isServer) {
        let payload = {
            result: to.query.__sso,
            meta: {
                refreshToken: to.query.__sst
            }
        };
        await rootStore.dispatch('user/forceLogin', payload)
        next('/')
    }
  next()
}
