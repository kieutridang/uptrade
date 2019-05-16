import React from 'react'
import QueueAnim from 'rc-queue-anim'

import FiltSearchCat from '../../../components/SearchBars/FiltSearchCat'
import CardItem from './components/CardItem'

const products = [
  {
    name: 'Silver Watch',
    img: require('../../../assets/images/demo/watch-silver.png'),
    sash: 'sash-success',
    sash_icon: 'bookmark',
    sash_text: 'Active Supplier',
    old_price: '$699.99',
    price: '$649.99',
    supplier: 'Yangjiang Watches Ltd'
  }, {
    name: 'Black Watch',
    img: require('../../../assets/images/demo/watch-black.png'),
    sash: 'sash-success',
    sash_icon: 'bookmark',
    sash_text: 'Active Supplier',
    old_price: '$699.99',
    price: '$649.99',
    supplier: 'Yangjiang Watches Ltd'
  }, {
    name: 'Red Watch',
    img: require('../../../assets/images/demo/watch-edition-red.png'),
    sash: 'sash-success',
    sash_icon: 'bookmark',
    sash_text: 'Active Supplier',
    old_price: '$699.99',
    price: '$649.99',
    supplier: 'Yangjiang Watches Ltd'
  }, {
    name: 'Blue Watch',
    img: require('../../../assets/images/demo/watch-edition-blue.png'),
    sash: 'sash-success',
    sash_icon: 'bookmark',
    sash_text: 'Active Supplier',
    old_price: '$699.99',
    price: '$649.99',
    supplier: 'Yangjiang Watches Ltd'
  }, {
    name: 'Black Watch',
    img: require('../../../assets/images/demo/watch-edition-black.png'),
    sash: 'sash-success',
    sash_icon: 'bookmark',
    sash_text: 'Active Supplier',
    old_price: '$699.99',
    price: '$649.99',
    supplier: 'Yangjiang Watches Ltd'
  }, {
    name: 'Sport Watch',
    img: require('../../../assets/images/demo/watch-sport-blue.png'),
    sash: 'sash-success',
    sash_icon: 'bookmark',
    sash_text: 'Active Supplier',
    old_price: '$699.99',
    price: '$649.99',
    supplier: 'Yangjiang Watches Ltd'
  }, {
    name: 'Sport Watch',
    img: require('../../../assets/images/demo/watch-sport-green.png'),
    sash: 'sash-success',
    sash_icon: 'bookmark',
    sash_text: 'Active Supplier',
    old_price: '$699.99',
    price: '$649.99',
    supplier: 'Yangjiang Watches Ltd'
  }, {
    name: 'Sport Watch',
    img: require('../../../assets/images/demo/watch-sport-white.png'),
    sash: 'sash-success',
    sash_icon: 'bookmark',
    sash_text: 'Active Supplier',
    old_price: '$699.99',
    price: '$649.99',
    supplier: 'Yangjiang Watches Ltd'
  }
]

class Store extends React.Component {
  render () {
    return (
      <section style={{ padding: 24 }}>
        <article className='article'>
          <h2 className='article-title page-title'>Market Place</h2>
          <FiltSearchCat />
          <QueueAnim type='bottom' className='ui-animate row'>
            {
              products.map((product, index) =>
                <CardItem key={index} data={product} />
              )
            }
          </QueueAnim>
        </article>
      </section>
    )
  }
}

export default Store
