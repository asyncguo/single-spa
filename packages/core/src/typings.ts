export interface ICustomProps {
  [str: string]: any;
  [num: number]: any;
}

export type HookType = (s?: ICustomProps) => Promise<any>

export interface IApplication {
  /**
   * 注册时参数
   */

  name: string
  loadApp: (s: any) => Promise<{
    bootstrap: HookType | HookType[]
    mount: HookType | HookType[]
    unmount: HookType | HookType[]
  }>
  activeWhen: (location: Window['location']) => boolean
  customProps?: ICustomProps

  /** 应用状态 */
  status?: string

  loadPromise?: Promise<IApplication>

  /**
   * 应用的生命周期
   */
  bootstrap?: (props?: ICustomProps) => Promise<void>
  mount?: (props?: ICustomProps) => Promise<void>
  unmount?: (props?: ICustomProps) => Promise<void>
}


export type IEventMap = PopStateEvent | HashChangeEvent