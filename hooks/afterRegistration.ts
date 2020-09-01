import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { isServer } from '@vue-storefront/core/helpers'

const setTokens = async () => {
  const params = new URLSearchParams(location.search)

  if (!params.has('__sso') || !params.has('__sst')) {
    return
  }

  const token = params.get('__sso')
  const refreshToken = params.get('__sst')
  const usersCollection = StorageManager.get('user')

  await usersCollection.setItem('current-token', token)
  await usersCollection.setItem('current-refresh-token', refreshToken)
}

export function afterRegistration () {
  if (!isServer) {
    setTokens()
  }
}
