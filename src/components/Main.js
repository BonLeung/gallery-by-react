require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from "react-dom"

// 获取图片相关的数据
let imageDatas = require("../data/imageDatas.json");

// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDataArr) {
  for (let i = 0; i < imageDataArr.length; i++) {
    let singleImageData = imageDataArr[i];

    singleImageData.imageURL = require("../images/" + singleImageData.fileName);

    imageDataArr[i] = singleImageData;
  }

  return imageDataArr;
})(imageDatas);

class ImgFigure extends React.Component {

  // imgFigure 的点击处理函数
  handleClick(event) {

    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    event.stopPropagation();
    event.preventDefault();
  }

  render() {

    let styleObj = {};

    // 如果 props 属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值并且不为0，添加旋转角度
    if (this.props.arrange.rotate) {
      (["MozTransform-", "msTransform", "WebkitTransform", "transform"]).forEach(function (value) {
        styleObj[value] = "rotate(" + this.props.arrange.rotate + "deg)"
      }.bind(this));
    }

    if (this.props.arrange.isCenter) {
      styleObj["zIndex"] = 11;
    }

    let imgFigureClassName = "img-figure";
    imgFigureClassName += this.props.arrange.isInverse ? " is-inverse" : "";

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick.bind(this)}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

// 控制组件
class ControllerUnit extends React.Component {

  handleClick(event) {
    // 如果点击的是当前选中状态的按钮，则翻转图片，否则将对应的图片居中
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    event.stopPropagation();
    event.preventDefault();
  }

  render() {
    let controllerUnitClassName = "controller-unit";

    // 如果对应的是居中的图片，显示控制按钮的居中状态
    if(this.props.arrange.isCenter) {
      controllerUnitClassName += " is-center";

      // 如果同时对应的是翻转图片，显示控制按钮的翻转状态
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += " is-inverse";
      }
    }

    return (
      <span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
    )
  }
}

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {
        x: [0, 0],
        topY: [0, 0]
      }
    };
    this.state = {
      imgsArrangeArr: [
        {
          /*pos: {
           left: '0',
           top: '0'
           },
           rotate: 0,  // 旋转角度
           isInverse: false,  // 是否翻转
           isCenter: false  // 图片是否居中
           */
        }
      ]
    }
  }

  // 获取区间内的一个随机值
  getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
  }

  // 获取 0-30° 之间的任意一个正负值
  get30DegRandom() {
    return (Math.random() > 0.5 ? "" : "-") + Math.ceil(Math.random() * 30);
  }

  inverse(index) {
    return function () {
      let imgArrangeArr = this.state.imgsArrangeArr;

      imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;

      this.setState({
        imgArrangeArr: imgArrangeArr
      });
    }.bind(this);
  }

  // 利用 rearrange 函数，居中对应 index 的图片
  center(index) {
    return function () {
      this.rearrange(index);
    }.bind(this);
  }

  // 重新布局所有图片
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),
      // 取一个或者不取
      topImgSpliceIndex = 0,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 首先居中 centerIndex 的图片
    imgsArrangeCenterArr[0].pos = centerPos;

    // 居中的 centerIndex 的图片不需要旋转
    imgsArrangeCenterArr[0].rotate = 0;

    // 设置居中图片的 isCenter 为 true
    imgsArrangeCenterArr[0].isCenter = true;

    // 取出要布上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      }
    }.bind(this));

    // 布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      // 前半部分布局左边，右半部份布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      console.log(imgsArrangeArr.length + "aaa");

      imgsArrangeArr[i] = {
        pos: {
          top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      };
    }
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  // 组件加载以后，为每张图片计算其位置的范围
  componentDidMount() {
    // 首先拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imggeFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: (halfStageW - halfImgW),
      top: (halfStageH - halfImgH)
    };

    // 计算左侧，右侧区域排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render() {

    let controllerUnits = [];
    let imgFigures = [];

    imageDatas.forEach(function (value, index) {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure key={"imgFigure" + index} data={value} ref={"imgFigure" + index}
                                 arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                                 center={this.center(index)}/>);

      controllerUnits.push(<ControllerUnit key={"controllerUnits" + index}
                                           arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                                           center={this.center(index)}/>)
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
