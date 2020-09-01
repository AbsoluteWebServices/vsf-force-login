import Vue from 'vue'
import config from 'config'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import * as types from '@vue-storefront/core/modules/user/store/mutation-types'

const setTokens = async () => {
  const params = new URLSearchParams(location.search)

  if (!params.has('__sso') || !params.has('__sst')) {
    return
  }

  const token = params.get('__sso')
  const refreshToken = params.get('__sst')
  const cache = Vue.prototype.$db.usersCollection

  await cache.setItem('current-token', token)
  await cache.setItem('current-refresh-token', refreshToken)
}

const coreStartSession = async (context) => {
  if (isServer || context.getters.isLocalDataLoaded) return
  const cache = Vue.prototype.$db.usersCollection

  const user = await cache.getItem(`current-user`)

  if (user) {
    context.commit(types.USER_INFO_LOADED, user)
  }

  context.commit(types.USER_START_SESSION)
  context.commit(types.USER_LOCAL_DATA_LOADED, true)

  cache.getItem('current-token', (err, res) => {
    if (err) {
      Logger.error(err, 'user')()
      return
    }

    if (res) {
      context.commit(types.USER_TOKEN_CHANGED, { newToken: res })
      context.dispatch('sessionAfterAuthorized')

      if (config.usePriceTiers) {
        cache.getItem('current-user', (err, userData) => {
          if (err) {
            Logger.error(err, 'user')()
            return
          }

          if (userData) {
            context.dispatch('setUserGroup', userData)
          }
        })
      }
    } else {
      Vue.prototype.$bus.$emit('session-after-nonauthorized')
    }
    Vue.prototype.$bus.$emit('session-after-started')
  })
}

const extendUserVuex = {
  actions: {
    async startSession (context) {
      await setTokens()
      return coreStartSession(context)
    }
  }
}

export const userExtend = {
  key: 'user',
  store: { modules: [{ key: 'user', module: extendUserVuex }] }
}
