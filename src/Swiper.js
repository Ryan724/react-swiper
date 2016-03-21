import React, { Component,PropTypes} from 'react';
import stepper from './stepper';
import mergeDiff from './mergeDiff';
/**
 * 1. XY 方向滑动
 * 		1.1 up down left right 四个方向 可任意配置滑动（单个方向，或者几个方向组合）
 * 2. maxLength 是否必须要达到
 * 		2.2 maxLength 默认为swipe组件width或者height
 * 		2.1 minLength 设置，默认在shouldFinish = true情况下minLength= maxLength*0.4
 * 		2.3 到达maxLength 时候，如何停止(弹性停止，直接卡值)，
 * 		2.4 到达maxLength 时候，是否可再弹性拖动
 */
class Swiper extends Component{

    getInitialConfig(){

    	return {
    		up:false,
    		down:false,
    		left:false,
    		right:false,
    		shouldFinishwhenOverMinLength:false,
    		maxLeftLength:0,
    		maxRightLength:0,
    		maxUpLength:0,
    		maxDownLength:0
    	}

    }

    constructor(props,context){
        super(props,context);
        let defaultConfig = this.getInitialConfig();
        this.state={endXY:[0,0],currentXY:[0,0]};
        this.config = mergeDiff(defaultConfig,this.props.config,key=>defaultConfig[key]);
    }

    /**
     * 记录触摸点位置
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
	doTouchStart = (e) =>{
		let {pageX,pageY} = e.changedTouches[0];
		this.refs.swiper.focus(); 
		this.startXY = [ pageX , pageY];
	}

	doTouchMove = (e) =>{
		let { maxLeftLength } = this.config;
		let { endXY }  = this.state;
		let offsetX = e.touches[0].pageX-this.startXY[0]; 
		let offsetX = e.touches[1].pageX-this.startXY[1]; 
		//位于左点不能继续左移，位于右点不能继续右移
		let couldNotMoveLeft = ( Math.abd(endXY[0]) === maxLeftLength && offsetX < 0 );
		let couldNotMoveRight = ( Math.abd(endXY[0]) === 0 && offsetX > 0 );
		//计算位移量
		let deviation = this.startXY[2] === "left"?  offset-maxSwiperLength:offset;
		if((couldNotMoveLeft || couldNotMoveRight)&&Math.abs(offset)<maxSwiperLength) return;
		if(Math.abs(deviation)<maxSwiperLength&&deviation<0){
		 	this.setState({deviation:deviation});
		}else if(this.state.deviation<0){
			this.touchEndX();
		}
	}

	doTouchEnd = () =>{
		let {maxSwiperLength,minSwiperLength} = this.config;
		let {deviation} = this.state;
		deviation = deviation < -minSwiperLength?maxSwiperLength:0;
		this.setState({endDeviation:deviation,deviation: -deviation});
	}

    reset(){
		this.setState({endXY:[0,0],currentXY:[0,0]});	
    }
	render(){
		let {children,className} =this.config;
		let style = this.makeTransition(this.state.deviation);
		return ( <div
					ref="swiper"
					tabIndex="3"
					className = {className}
					onBlur = {::this.reset}
					onTouchStart={::this.doTouchStart}
					onTouchMove={::this.doTouchMove}
					onTouchEnd = {::this.doTouchEnd}
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