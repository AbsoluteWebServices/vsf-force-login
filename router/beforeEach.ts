import { Route } from 'vue-router'
import { isServer } from '@vue-storefront/core/helpers'

export function beforeEachGuard (to: Route, from: Route, next): void {
  if (!isServer && Object.keys(to.query).length !== 0 && to.query.hasOwnProperty('__sso')) {
    delete to.query.__sso

    if (to.query.hasOwnProperty('__sst')) {
      delete to.query.__sst
    }

    next(to)
  } else {
    next()
  }
}
