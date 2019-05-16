import React from 'react'
import QueueAnim from 'rc-queue-anim'

import AddSearchUpDown from '../../../components/SearchBars/AddSearchUpDown'
import EnhancedTable from './components/EnhancedTable'

const Page = () => (
  <div style={{ padding: 24 }}>
    <QueueAnim type='bottom' className='ui-animate'>
      <div key='1'>
        <article className='article master'>
          <h2 className='article-title page-title'>Marketplace Admin Portal</h2>
          <AddSearchUpDown />
          <EnhancedTable />
        </article>
      </div>
    </QueueAnim>
  </div>

)

export default Page
