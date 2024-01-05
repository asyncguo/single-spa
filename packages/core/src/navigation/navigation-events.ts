import { IEventMap } from "src/typings";

// 捕获到的事件回调
const capturedEventListeners: {
  hashchange: any[]
  popstate: any[]
} = {
  hashchange: [],
  popstate: [],
};

export const routingEventsListeningTo = ["hashchange", "popstate"];

function callCapturedEventListeners(eventArguments?: IEventMap[]) {
  if (eventArguments) {
    const eventType = eventArguments[0].type as ('hashchange' | 'popstate')
    if (routingEventsListeningTo.indexOf(eventType) >= 0) {
      // 开始执行捕获到的事件回调
      capturedEventListeners[eventType].forEach((listener) => {
        try {
          listener.apply(this, eventArguments)
        } catch (error) {
          // 异步丢出事件中的异常，无需阻塞当前子应用的后续流程
          setTimeout(() => {
            throw error
          })
        }
      })
    }
  }
}

export {
  callCapturedEventListeners
}
