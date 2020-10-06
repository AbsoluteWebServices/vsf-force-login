import Vue from 'vue'
import coreActions from '@vue-storefront/core/modules/user/store/actions'
import rootStore from '@vue-storefront/core/store'

const setTokens = async () => {
  const params = new URLSearchParams(location.search)

  if (!params.has('__sso')) {
    return
  }

  await rootStore.dispatch('user/clearCurrentUser', {silent: true}).then(async () => {
    // clear cart cache
    const cartCache = Vue.prototype.$db.cartsCollection
    await cartCache.setItem('current-cart-token', null)
    await cartCache.setItem('current-cart-hash', null)
    await cartCache.setItem('current-cart', null)

    const token = params.get('__sso')
    const cache = Vue.prototype.$db.usersCollection

    await cache.setItem('current-token', token)

    // we add to the cache we came from sso, useful for detecting on auth page
    await cache.setItem('source-sso', true)

    if (params.hasOwnProperty('__sst')) {
      const refreshToken = params.get('__sst')
      await cache.setItem('current-refresh-token', refreshToken)
    }
  })
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
