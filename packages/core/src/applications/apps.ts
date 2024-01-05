import { isInBrowser } from "src/utils/runtime-environment"
import { LOADING_SOURCE_CODE, LOAD_ERROR, MOUNTED, NOT_BOOTSTRAPPED, NOT_LOADED, NOT_MOUNTED, SKIP_BECAUSE_BROKEN, shouldBeActive } from "./app.helpers"
import { reroute } from "src/navigation/reroute"
import type { IApplication } from "src/typings"
import { getAppUnloadInfo } from "src/lifecycles/unload"

const apps: Array<IApplication> = []

/**
 * 注册子应用
 */
function registerApplication(options: IApplication) {
  const {
    name,
    loadApp,
    activeWhen,
    customProps = {}
  } = options

  apps.push({
    status: NOT_LOADED,

    name,
    loadApp,
    activeWhen,
    customProps
  })

  if (isInBrowser) {
    reroute()
  }
}

function getAppChanges() {
  /** 需要移除的应用 */
  const appsToUnload: Array<IApplication> = []
  /** 需要卸载的应用 */
  const appsToUnmount: Array<IApplication> = []
  /** 需要加载的应用 */
  const appsToLoad: Array<IApplication> = []
  /** 需要挂载的应用 */
  const appsToMount: Array<IApplication> = []

  apps.forEach(app => {
    // 根据 activeWhen 判断当前 app 是否应该激活
    const appShouldBeActive = app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app)

    // 根据 app 状态收集需要进行不同操作的应用
    switch (app.status) {
      case LOAD_ERROR:
        if (appShouldBeActive) {
          appsToLoad.push(app)
        }
        break;
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        if (appShouldBeActive) {
          appsToLoad.push(app)
        }
      case NOT_BOOTSTRAPPED:
      case NOT_MOUNTED:
        if (!appShouldBeActive && getAppUnloadInfo(app.name)) {
          appsToUnload.push(app)
        } else if (appShouldBeActive) {
          appsToMount.push(app)
        }
      case MOUNTED:
        if (!appShouldBeActive) {
          appsToUnmount.push(app)
        }
    }
  })

  return {
    appsToUnload,
    appsToUnmount,
    appsToLoad,
    appsToMount
  }
}

export {
  registerApplication,
  getAppChanges
}
