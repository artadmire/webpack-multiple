import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import FETCH from 'FETCH_DATA';
import './index.css';
import Axios from 'axios';
import imgUrl from '@/assets/222.jpg';
import svg from '@/assets/circle.svg';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '麦乐',
    };
  }

  componentDidMount() {
    console.log('我是麦乐'); // 这里是打印日志
    Axios.get('/api/login', {}).then((res) => console.log(res.data));
  }

  render() {
    const { name } = this.state;
    return (
      <h1>
        什么情况ds
        {name}
        <img src={svg} alt="" />
        <img src={imgUrl} alt="" />
      </h1>

    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
