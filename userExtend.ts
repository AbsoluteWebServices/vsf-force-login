import * as types from "@vue-storefront/core/modules/user/store/mutation-types";

const extendUserVuex = {
  actions: {
    async forceLogin ({ dispatch, commit }, payload: { result: string, meta: any }) {
        await dispatch('clearCurrentUser')
        commit(types.USER_TOKEN_CHANGED, { newToken: payload.result, meta: payload.meta })
        await dispatch('me', { refresh: true, useCache: false })
        await dispatch('getOrdersHistory', { refresh: true, useCache: false })
    }
  }
}

export const userExtend = {
  key: 'user',
  store: { modules: [{ key: 'user', module: extendUserVuex }] },
}
