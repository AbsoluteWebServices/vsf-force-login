import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { isServer } from '@vue-storefront/core/helpers'

const setTokens = async () => {
  const params = new URLSearchParams(location.search)

  if (!params.has('__sso')) {
    return
  }

  const token = params.get('__sso')
  const usersCollection = StorageManager.get('user')

  await usersCollection.setItem('current-token', token)

  if (params.hasOwnProperty('__sst')) {
    const refreshToken = params.get('__sst')
    await usersCollection.setItem('current-refresh-token', refreshToken)
  }
}

export function afterRegistration () {
  if (!isServer) {
    setTokens()
  }
}
