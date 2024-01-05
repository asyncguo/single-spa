import { HookType, IApplication, ICustomProps } from "src/typings";

type IAppConfig = Awaited<ReturnType<IApplication['loadApp']>>

function flattenFnArray(
  app: IAppConfig, 
  lifecycle: 'bootstrap' | 'mount' | 'unmount'
) {
  let fns: HookType | HookType[] = app[lifecycle] || []
  fns = Array.isArray(fns) ? fns : [fns]

  if (fns.length === 0) {
    fns = [() => Promise.resolve()]
  }

  return function (props?: ICustomProps) {
    return (fns as HookType[]).reduce((resultPromise, fn, index) => {
      return resultPromise.then(() => {
        const _primseFn = fn(props)

        // TODO: fn 必须 return promise
        return _primseFn
      })
    }, Promise.resolve())
  }
}

export {
  flattenFnArray
};
