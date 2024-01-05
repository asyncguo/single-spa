import type { IApplication } from "src/typings";

// App statuses

/** 未加载 */
export const NOT_LOADED = "NOT_LOADED";
/** 加载子应用中 */
export const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE";
/** 加载完成，未执行 bootstrap 钩子 */
export const NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED";
/** 正在执行 bootstrap 钩子 */
export const BOOTSTRAPPING = "BOOTSTRAPPING";
/** 待挂载 */
export const NOT_MOUNTED = "NOT_MOUNTED";
/** 挂载中 */
export const MOUNTING = "MOUNTING";
/** 挂载完成 */
export const MOUNTED = "MOUNTED";
/** service 更新中 */
export const UPDATING = "UPDATING";
/** 卸载中 */
export const UNMOUNTING = "UNMOUNTING";
export const UNLOADING = "UNLOADING";
/** 加载失败 */
export const LOAD_ERROR = "LOAD_ERROR";
/** 变更状态发生错误 */
export const SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN";

export function shouldBeActive(app: IApplication) {
  try {
    return app.activeWhen(window.location)
  } catch (error) {
    return false
  }
}
