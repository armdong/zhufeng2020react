import { createDOM } from "./react-dom";
import { isFunction } from "./utils";

export let updateQueue = {
  updaters: [],
  isBatchingUpdate: false,
  add(updater) {
    this.updaters.push(updater);
  },
  batchUpdate() {
    this.updaters.forEach((updater) => updater.updateComponent());
    this.isBatchingUpdate = false;
  },
};

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
  }
  addState(partialState) {
    this.pendingStates.push(partialState);
    updateQueue.isBatchingUpdate
      ? updateQueue.add(this)
      : this.updateComponent();
  }
  updateComponent() {
    let { classInstance, pendingStates } = this;
    if (pendingStates.length > 0) {
      classInstance.state = this.getState();
      classInstance.forceUpdate();
    }
  }
  getState() {
    let { classInstance, pendingStates } = this;
    let { state } = classInstance;
    if (pendingStates.length) {
      pendingStates.forEach((nextState) => {
        if (isFunction(nextState)) {
          nextState = nextState.call(classInstance, state);
        }
        state = { ...state, ...nextState };
      });
      pendingStates.length = 0;
    }
    return state;
  }
}

class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }
  setState(partialState) {
    this.updater.addState(partialState);
  }
  forceUpdate() {
    let newVdom = this.render();
    updateClassComponent(this, newVdom);
  }
}

function updateClassComponent(classInstance, newVdom) {
  let oldDOM = classInstance.dom;
  let newDOM = createDOM(newVdom);
  oldDOM.parentNode.replaceChild(newDOM, oldDOM);
  classInstance.dom = newDOM;
}

export default Component;
