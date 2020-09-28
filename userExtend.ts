import Vue from 'vue'
import coreActions from '@vue-storefront/core/modules/user/store/actions'

const setTokens = async () => {
  const params = new URLSearchParams(location.search)

  if (!params.has('__sso')) {
    return
  }

  const token = params.get('__sso')
  const cache = Vue.prototype.$db.usersCollection

  await cache.setItem('current-token', token)

  if (params.hasOwnProperty('__sst')) {
    const refreshToken = params.get('__sst')
    await cache.setItem('current-refresh-token', refreshToken)
  }
}

const extendUserVuex = {
  actions: {
    coreStartSession: coreActions.startSession,
    async startSession ({ dispatch }) {
      await setTokens()
      return dispatch('coreStartSession')
    }
  }
}

export const userExtend = {
  key: 'user',
  store: { modules: [{ key: 'user', module: extendUserVuex }] }
}
