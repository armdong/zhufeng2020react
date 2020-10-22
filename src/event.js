/**
 * React中的合成事件主要是为了实现批量更新，其次还可以实现事件持久化
 */

import { updateQueue } from "./Component";

/**
 * 给哪个DOM元素绑定哪种类型的事件
 * @param {*} dom 给哪个DOM元素绑定事件
 * @param {*} eventType 事件类型
 * @param {*} listener 事件处理函数
 */
export function addEvent(dom, eventType, listener) {
  let store = dom.store || (dom.store = {});
  store[eventType] = listener;
  if (!document[eventType]) {
    document[eventType] = dispatchEvent;
  }
}

let syntheticEvent = {};

function dispatchEvent(event) {
  let { target, type } = event;
  let eventType = `on${type}`;

  // 开启批量更新
  updateQueue.isBatchingUpdate = true;
  let syntheticEvent = createSyntheticEvent(event);

  while (target) {
    let { store } = target;
    let listener = store && store[eventType];
    listener && listener.call(target, syntheticEvent);
    target = target.parentNode;
  }

  for (let key in syntheticEvent) {
    syntheticEvent[key] = null;
  }

  updateQueue.batchUpdate();
}

function createSyntheticEvent(nativeEvent) {
  for (let key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key];
  }
  return syntheticEvent;
}
