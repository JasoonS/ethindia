import React, { Component } from 'react';

import Template from './Template';
import About from './About';

class BaseComponent extends Component {
  render() {
    return (
      <div className='App'>
        <Template />
        <About />
      </div>
    );
  }
}

export default BaseComponent;
