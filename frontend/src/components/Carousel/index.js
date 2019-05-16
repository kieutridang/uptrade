import React from 'react'
import Slider from 'react-slick'
import LightBox from 'react-images'

var settings = {
  dots: false,
  infinite: true,
  speed: 500
}

class Carousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLightBoxOpen: false,
      currentImage: 0
    }
  }

  _handleOpenLightBox = () => {
    this.setState({ isLightBoxOpen: true })
  }

  _handleCloseLightBox = () => {
    this.setState({ isLightBoxOpen: false })
  }

  _gotoNextImage = () => {
    this.setState({ currentImage: this.state.currentImage + 1 })
  }

  _gotoPreviousImage = () => {
    this.setState({ currentImage: this.state.currentImage - 1 })
  }

  render() {
    const { slidesToShow, slidesToScroll, autoplay, data, className } = this.props
    return (
      <div>
        <Slider
          className={className}
          slidesToShow={slidesToShow || 1}
          slidesToScroll={slidesToScroll || 1}
          autoplay={autoplay || false}
          {...settings}
        >
          {
            data && data.map((item, index) =>
              <div key={index}>
                <img src={item} alt='' onClick={this._handleOpenLightBox}/>
              </div>
            )
          }
        </Slider>
        <LightBox
          currentImage={this.state.currentImage}
          onClickPrev={this._gotoPreviousImage}
          onClickNext={this._gotoNextImage}
          images={data.map(item => ({ src: item }))}
          isOpen={this.state.isLightBoxOpen}
          onClose={this._handleCloseLightBox}/>
      </div>
    )
  }
}

export default Carousel
