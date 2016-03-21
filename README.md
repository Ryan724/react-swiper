import React, { Component,PropTypes} from 'react';
import stepper from './stepper';
import mergeDiff from './mergeDiff';
/**
 * 1. XY 方向滑动
 * 		1.1 up down left right 四个方向 可任意配置滑动（单个方向，或者几个方向组合）
 * 2. maxLength 是否必须要达到
 * 		2.2 maxLength 默认为swipe组件width或者height
 * 		2.1 minLength 设置，默认在shouldFinish = true情况下minLength= maxLength*0.4
 */
class Swiper extends Component{
    getInitialConfig(){
    	return {
    		left
    	}
    }
    constructor(props,context){
        super(props,context);
        this.state={endDeviation:0,deviation:0}
    }

    reset(){
		this.setState({endDeviation:0,deviation:0 });	
    }

	touchStart = (e) =>{
		let {clientX,clientY} = e.touches[0];
		let startPoint =this.state.endDeviation === 0 ?"right":"left";
		this.refs.swiper.focus();
		this.startXY = [clientX ,clientY,startPoint];
	}

	touchMove = (e) =>{
		let {maxSwiperLength} = this.props;
		//向左负值，向右正值
		let offset = e.touches[0].clientX-this.startXY[0]; 
		//位于左点不能继续左移，位于右点不能继续右移
		let couldNotMoveLeft = (this.startXY[2] === "left"&&offset<0);
		let couldNotMoveRight = (this.startXY[2] === "right"&&offset>0);
		//计算位移量
		let deviation = this.startXY[2] === "left"?  offset-maxSwiperLength:offset;
		if((couldNotMoveLeft || couldNotMoveRight)&&Math.abs(offset)<maxSwiperLength) return;
		if(Math.abs(deviation)<maxSwiperLength&&deviation<0){
		 	this.setState({deviation:deviation});
		}else if(this.state.deviation<0){
			this.touchEndX();
		}
	}

	touchEnd = () =>{
		let {maxSwiperLength,minSwiperLength} = this.props;
		let {deviation} = this.state;
		deviation = deviation < -minSwiperLength?maxSwiperLength:0;
		this.setState({endDeviation:deviation,deviation: -deviation});
	}
	render(){
		let {key,children,className} =this.props;
		let style = this.makeTransition(this.state.deviation);
		return ( <div
					ref="swiper"
					tabIndex="3"
					onBlur = {::this.reset}
					className = {className}
					onTouchStart={::this.touchStart}
					onTouchMove={::this.touchMove}
					onTouchEnd = {::this.touchEnd
					style={style}>
					{this.props.children}
		        </div>
		       );
	}
	makeTransition (x) {
		let {maxSwiperLength,minSwiperLength} = this.props;
		let style= {
			MsTransform: `translate(${x}px,0)`,
			WebkitTransform: `translate(${x}px,0)`,
			transform: `translate(${x}px,0)`,
		}
		if(Math.abs(x)==maxSwiperLength||x==0) style.transition = "transform 0.2s ease"
		style = mergeDiff(this.props.style,style,key=>this.props.style[key]);
		return style;
	}
}

export default Swiper;