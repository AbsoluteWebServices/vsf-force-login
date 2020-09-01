import { createModule } from '@vue-storefront/core/lib/module'
import { beforeEachGuard } from './router/beforeEach'

const KEY = 'vsf-force-login'
export const VsfForceLogin = createModule({
  key: KEY,
  router: { beforeEach: beforeEachGuard }
})

export { userExtend } from './userExtend'
