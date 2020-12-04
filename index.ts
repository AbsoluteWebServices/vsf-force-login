import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { beforeEachGuard } from './router/beforeEach'
import { afterRegistration } from './hooks/afterRegistration'

export const ForceLoginModule: StorefrontModule = async function ({ router }) {
  StorageManager.init('user')
  StorageManager.init('cart')
  router.beforeEach(beforeEachGuard)
  afterRegistration()
}
