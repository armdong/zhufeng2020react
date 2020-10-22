import { addEvent } from "./event";

function render(vdom, container) {
  const dom = createDOM(vdom);
  container.appendChild(dom);
}

export function createDOM(vdom) {
  if (["string", "number"].includes(typeof vdom)) {
    return document.createTextNode(vdom);
  }

  let { type, props } = vdom;
  let dom;
  if (typeof type === "function") {
    return type.isReactComponent
      ? updateClassComponent(vdom)
      : updateFunctionComponent(vdom);
  } else {
    dom = document.createElement(type);
  }

  // 更新属性
  updateProps(dom, props);

  if (["string", "number"].includes(typeof props.children)) {
    // 文本和数值
    dom.textContent = props.children;
  } else if (typeof props.children === "object" && props.children.type) {
    // 虚拟DOM
    render(props.children, dom);
  } else if (Array.isArray(props.children)) {
    // 数组
    reconcileChildren(props.children, dom);
  } else {
    dom.textContent = props.children ? props.children.toString() : "";
  }

  return dom;
}

function updateFunctionComponent(vdom) {
  const { type, props } = vdom;
  const renderVdom = type(props);
  return createDOM(renderVdom);
}

function updateClassComponent(vdom) {
  const { type, props } = vdom;
  const classInstance = new type(props);
  const renderVdom = classInstance.render();
  const dom = createDOM(renderVdom);
  classInstance.dom = dom;
  return dom;
}

function updateProps(dom, props) {
  for (let key in props) {
    if (key === "children") continue;
    if (key === "style") {
      let style = props[key];
      for (let attr in style) {
        dom.style[attr] = style[attr];
      }
    } else if (key.startsWith("on")) {
      addEvent(dom, key.toLocaleLowerCase(), props[key]);
    } else {
      dom[key] = props[key];
    }
  }
}

function reconcileChildren(childrenVdom, parentDOM) {
  for (let childVdom of childrenVdom) {
    render(childVdom, parentDOM);
  }
}

export default { render };
