import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import FETCH from 'FETCH_DATA';
import './index.css';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '麦乐',
    };
  }

  render() {
    const { name } = this.state;
    return (
      <h1>
        这里是个人中心
        {name}
      </h1>
    );
  }
}
ReactDom.render(<App />, document.getElementById('root'));
