# single-spa 最小实现

## Feature

- registerApplication
- start


## Usage

注册子应用

```js
registerApplication({
  name: 'appName',
  loadApp: async () => {
    return {
      bootstrap: () => Promise.resolve(),
      mount: () => Promise.resolve(),
      unmount: () => Promise.resolve()
    }
  },
  activeWhen: () => location.pathname.startswith('app'),
  customProps: {}
})
```

开启主应用

```js
start()
```
