import React from 'react'
import QueueAnim from 'rc-queue-anim'
import ComplexInteractionItem from './components/ComplexInteractionItem'

import AddInline from '../../../../components/InlineBars/AddInline'

const complexInteractionItems = [
  {
    avatar: 'A',
    cardTitle: 'Metal cars',
    date: 'October 23, 2018',
    imageUrl: require('../../../../assets/images/demo/prod7.png'),
    title: 'Contemplative Reptile',
    info: 'Set of 4 Pull Back Action Cars, 1955 Chevy Stepside Pick-Up Trucks. Color assortment: Black, Blue, Red and Yellow.'
  },
  {
    avatar: 'R',
    cardTitle: 'Paper house',
    date: 'October 24, 2018',
    imageUrl: require('../../../../assets/images/demo/prod6.png'),
    title: 'Contemplative Reptile',
    info: 'EASY ASSEMBLY: Cottage folds up and down in one easy step and measures 56"L x 36"W x 49"H'
  },
  {
    avatar: 'R',
    cardTitle: 'Led candles',
    date: 'October 24, 2018',
    imageUrl: require('../../../../assets/images/demo/prod5.png'),
    title: 'Contemplative Reptile',
    info: 'Flameless Flickering LED tea lights. Main material: Plastic. Light color: Warm yellow (Amber)'
  },
  {
    avatar: 'A',
    cardTitle: 'Metal cars',
    date: 'October 23, 2018',
    imageUrl: require('../../../../assets/images/demo/prod4.png'),
    title: 'Contemplative Reptile',
    info: 'Set of 4 Pull Back Action Cars, 1955 Chevy Stepside Pick-Up Trucks. Color assortment: Black, Blue, Red and Yellow.'
  }
]
const Section1 = () => (
  <div className='container'>
    <div className='row'>
      {
        complexInteractionItems && complexInteractionItems.map((item, index) => (
          <ComplexInteractionItem key={index} data={item} />
        ))
      }
    </div>
  </div>
)

const Page = () => (
  <section className='container-fluid container-mw-xl chapter'>
    <article className='article'>
      <h2 className='article-title page-title'>Christmas Concept<AddInline /></h2>
      <QueueAnim type='bottom' className='ui-animate'>
        <div key='1'><Section1 /></div>
      </QueueAnim>
    </article>
  </section>
)

export default Page
