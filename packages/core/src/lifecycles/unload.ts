import { IApplication } from "src/typings";

const appsToUnload: Record<IApplication['name'], IApplication> = {};

function getAppUnloadInfo(appName: string) {
  return appsToUnload[appName]
}

export {
  getAppUnloadInfo
}
