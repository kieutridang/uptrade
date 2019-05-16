import React from 'react'
import QueueAnim from 'rc-queue-anim'
import MediaItem from './components/MediaItem'
import AddSearch from '../../components/SearchBars/AddSearch'
// Demo
import media1ImageUrl from '../../assets/images/demo/merchandising.jpg'
import media2ImageUrl from '../../assets/images/demo/squeezer4.png'

const moodBoardItems = [
  {
    imageUrl: media1ImageUrl,
    title: 'Ambiante',
    cardTitle: 'Christmas',
    info: 'All items to be sourced by October 2019 for seasonal promotions.',
    btnName: 'Dragon Mountain',
    linkHref: '/moodboard/detail'
  },
  {
    imageUrl: media2ImageUrl,
    title: 'Ambiante',
    cardTitle: 'Christmas',
    info: 'All items to be sourced by October 2019 for seasonal promotions.',
    btnName: 'Dragon Mountain',
    linkHref: '/moodboard/detail'
  }
]
const Section1 = () => (
  <div className='container'>
    <div className='row'>
      {
        moodBoardItems && moodBoardItems.map((item, index) => (
          <MediaItem key={index} data={item} />
        ))
      }
    </div>
  </div>
)

const MoodBoard = () => (
  <section style={{ padding: 24 }}>
    <article className='article'>
      <h2 className='article-title page-title'>Mood Boards</h2>
      <AddSearch />
      <QueueAnim type='bottom' className='ui-animate'>
        <div key='1'><Section1 /></div>
      </QueueAnim>
    </article>
  </section>
)

export default MoodBoard
