import { LOADING_SOURCE_CODE, LOAD_ERROR, NOT_BOOTSTRAPPED, NOT_LOADED } from "src/applications/app.helpers";
import { IApplication } from "src/typings";
import { getProps } from "./prop.helpers";
import { flattenFnArray } from "./lifecycle.helpers";

function toLoadPromise(app: IApplication) {
  return Promise.resolve().then(() => {
    if (app.loadPromise) {
      // 存在 loadPromise 即为正在加载中，返回 loadPromise 即可
      return app.loadPromise
    }

    if (
      app.status !== NOT_LOADED && 
      app.status !== LOAD_ERROR
    ) {
      return app
    }

    app.status = LOADING_SOURCE_CODE

    return (app.loadPromise = Promise.resolve().then(() => {
      // 执行 loadApp 进行加载子应用
      const loadPromise = app.loadApp(getProps(app))

      return loadPromise.then((val) => {
        app.status = NOT_BOOTSTRAPPED

        app.bootstrap = flattenFnArray(val, 'bootstrap')
        app.mount = flattenFnArray(val, 'mount')
        app.unmount = flattenFnArray(val, 'unmount')

        // 加载完成，删除加载中状态
        delete app.loadPromise

        return app
      })
    }))
  }).catch(() => {
    delete app.loadPromise

    app.status = LOAD_ERROR

    return app
  })
}

export {
  toLoadPromise
}
