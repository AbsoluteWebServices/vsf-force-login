import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { isServer } from '@vue-storefront/core/helpers'

const setTokens = () => {
  const params = new URLSearchParams(location.search)

  if (!params.has('__sso')) {
    return
  }

  const token = params.get('__sso')
  const usersCollection = StorageManager.get('user')

  usersCollection.setItem('current-token', token)

  if (params.hasOwnProperty('__sst')) {
    const refreshToken = params.get('__sst')
    usersCollection.setItem('current-refresh-token', refreshToken)
  }

  const cartCollection = StorageManager.get('cart')

  cartCollection.setItem('current-cart-token', null)
  cartCollection.setItem('current-cart-hash', null)
  cartCollection.setItem('current-cart', null)
}

export function afterRegistration () {
  if (!isServer) {
    setTokens()
  }
}
