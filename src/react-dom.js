function render(vdom, container) {
  const dom = createDOM(vdom);
  container.appendChild(dom);
}

export function createDOM(vdom) {
  if (["string", "number"].includes(typeof vdom)) {
    return document.createTextNode(vdom);
  }

  let { type, props } = vdom;
  let dom = document.createElement(type);

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

function updateProps(dom, props) {
  for (let key in props) {
    if (key === "children") continue;
    if (key === "style") {
      let style = props[key];
      for (let attr in style) {
        dom.style[attr] = style[attr];
      }
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
