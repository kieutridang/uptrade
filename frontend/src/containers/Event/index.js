import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { graphql } from 'react-apollo'

import MediaItem from './components/MediaItem'
import AddSearch from '../../components/SearchBars/AddSearch'
import { ComponentLoading } from '../../components/Loading'
import { QUERY_EVENTS } from './event.typedef'

const MediaList = (props) => {
  let content = <ComponentLoading />
  if (props.getEvents.loading) {
    content = <ComponentLoading />
  } else {
    const { events } = props.getEvents.events
    content = (
      <div className='container' id='events-list'>
        <div className='row'>
          {events && events.map((item) => (
            <MediaItem key={item._id} data={item} {...props} />
          ))}
        </div>
      </div>
    )
  }
  return content
}

class EventList extends React.Component {
  openCreateEventHandler = () => {
    this.props.history.push('/events/new')
  }
  componentWillMount () {
    this.props.getEvents.refetch({
      page: 1,
      limit: 1000
    })
  }
  render () {
    return (
      <section style={{ padding: 24 }}>
        <article className='article'>
          <h2 className='article-title page-title'>Events</h2>
          <AddSearch addNewHandler={this.openCreateEventHandler} />
          <QueueAnim type='bottom' className='ui-animate'>
            <div key='1'><MediaList getEvents={this.props.getEvents} {...this.props} /></div>
          </QueueAnim>
        </article>
      </section>
    )
  }
}

export default graphql(QUERY_EVENTS, {
  name: 'getEvents',
  options: props => {
    return {
      variables: {
        page: 1,
        limit: 1000
      }
    }
  }
})(EventList)
