import React from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
class CardItem extends React.Component {
  render () {
    const { data } = this.props
    return (
      <div className='col-xl-3 col-lg-3 mb-4'>
        <div className='item-card'>
          <div className={classnames('sash sash-triangle-right', data.sash)}>
            <div>
              <i className='material-icons'>{data.sash_icon}</i>
              <span className='sash-text'>{data.sash_text}</span>
            </div>
          </div>
          <Link to='' className='card__image'>
            <img alt='data' src={data.img} />
          </Link>
          <div className='card__body card-white'>
            <div className='card__title'>
              <span>Accessories</span>
              <Link to=''>{data.name}</Link>
            </div>
            <div className='card__price'>
              <span className='type--strikethrough'>{data.old_price}</span>
              <span>{data.price}</span>
            </div>
            <div className='card__title'>
              <Link to='' className='supname'>{data.supplier}</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CardItem
