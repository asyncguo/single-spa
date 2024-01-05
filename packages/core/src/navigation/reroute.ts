import { getAppChanges } from "src/applications/apps";
import { toLoadPromise } from "src/lifecycles/load";
import { isStarted } from "src/start";
import { IApplication, IEventMap } from "src/typings";
import { callCapturedEventListeners } from "./navigation-events";

let appChangeUnderway = false
let peopleWaitingOnAppChange = []

function reroute(
  pendingPromises: {
    eventArguments?: IEventMap[]
  }[] = [],
  eventArguments?: IEventMap[],
  silentNavigation = false
) {
  /**
   * 应用正在切换路由时，又重新切换了路由，会先缓存当前操作
   */
  if (appChangeUnderway) {
    return new Promise((resolve, reject) => {
      peopleWaitingOnAppChange.push({
        resolve,
        reject,
        eventArguments
      })
    })
  }

  // 获取需要改变的应用
  const { 
    appsToUnload,
    appsToUnmount,
    appsToLoad,
    appsToMount
  } = getAppChanges();

  let appsThatChanged: Array<IApplication>

  if (isStarted()) {
    // 路由更新时对应的逻辑
    appChangeUnderway = true
    appsThatChanged = appsToUnload.concat(
      appsToLoad,
      appsToUnmount,
      appsToMount
    );

    return performAppChanges()
  } else {
    // 首次加载，只会加载第一个匹配到的子应用
    appsThatChanged = appsToLoad
    return loadApps()
  }

  function loadApps() {
    return Promise.resolve().then(() => {
      // 异步处理【待加载】的应用，执行 loadApp ，将 bootstrap、mount、unmout 挂载到 app 上
      const loadPromises = appsToLoad.map(toLoadPromise);

      return (
        Promise.all(loadPromises)
          .then(callAllEventListeners)
          // there are no mounted apps, before start() is called, so we always return []
          .then(() => [])
          .catch(err => {
            callAllEventListeners();
            throw err
          })
      )
    })
  }

  function performAppChanges() {}

  function callAllEventListeners() {
    if (!silentNavigation) {
      pendingPromises.forEach((pendingPromise) => {
        callCapturedEventListeners(pendingPromise.eventArguments);
      });

      callCapturedEventListeners(eventArguments);
    }
  }
}

export {
  reroute
}
