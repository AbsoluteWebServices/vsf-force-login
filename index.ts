import { createModule } from '@vue-storefront/core/lib/module'
import { beforeEach } from './router/beforeEach'

const KEY = 'vsf-force-login'
export const VsfForceLogin = createModule({
  key: KEY,
  router: { beforeEach }
})

export { userExtend } from './userExtend'
