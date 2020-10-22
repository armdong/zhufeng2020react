import React from "./react";
import ReactDOM from "./react-dom";

class Sum extends React.Component {
  constructor(props) {
    super(props);

    this.a = React.createRef();
    this.b = React.createRef();
    this.result = React.createRef();
  }

  handleAdd = () => {
    let a = this.a.current.value;
    let b = this.b.current.value;
    this.result.current.value = a + b;
  };

  render() {
    return (
      <>
        <input type="text" ref={this.a} />
        <input type="text" ref={this.b} />
        <button onClick={this.handleAdd}>=</button>
        <input type="text" ref={this.result} />
      </>
    );
  }
}

ReactDOM.render(<Sum />, document.getElementById("root"));
