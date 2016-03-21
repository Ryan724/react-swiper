import React, { Component, PropTypes } from 'react';
import Swiper from '../src/Swiper';

class Demo extends Component{

  render() {
    let style = {"width":"400px","height":"100px","overflow":"hidden"};
    let config = {maxSwiperLength:100,
              minSwiperLength:40

    }
    return (
      <div style={{...style,"background":"red"}}>
        <Swiper
            className="filter_item"
            style={{...style,"background":"blue"}}
            config = {config} >
        </Swiper>
      </div>);
    
  }
};

export default Demo;