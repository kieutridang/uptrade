import React from 'react'

import './index.scss'

class Slider extends React.PureComponent {
  render () {
    const { value, handler, min, max, step } = this.props
    return (
      <span className='col-sm-12'>
        <input onChange={handler} type='range' step={step} min={min} max={max} value={value} className='slider' id='myRange' />
      </span>
    )
  }
}

export default Slider
