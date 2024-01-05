import { IApplication } from "src/typings"

const getProps = (app: IApplication) => {
  let customProps = typeof app.customProps === 'function'
    ? app.customProps(name, window.location)
    : app.customProps

  if (
    typeof customProps !== 'object' ||
    customProps === null ||
    Array.isArray(customProps)
  ) {
    customProps = {}
  }
  
  return {
    ...customProps,
    name,
  }
}

export {
  getProps
}