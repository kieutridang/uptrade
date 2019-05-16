import React from 'react'
import Radio from '@material-ui/core/Radio'

const NotificationDetail = () => (
  <form noValidate autoComplete='off' style={{ width: '100%' }}>
    <div className='container'>
      <div className='row bold text-center' style={{ marginTop: '20px' }}>
        <div className='col-sm-2 text-left'>
          Newsletter
        </div>
        <div className='col-sm-2'>
          Instant
        </div>
        <div className='col-sm-2'>
          Daily
        </div>
        <div className='col-sm-2'>
          Weekly
        </div>
        <div className='col-sm-2'>
          Monthly
        </div>
        <div className='col-sm-2'>
          Unsuscribe
        </div>
      </div>
      <div className='row tablestylein' style={{ marginTop: '12px' }}>
        <div className='col-sm-2'>
          <p>Messages</p>
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            checked
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
      </div>
      <div className='row tablestylein'>
        <div className='col-sm-2' >
          <p>Products</p>
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
            checked
          />
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
      </div>
      <div className='row tablestylein'>
        <div className='col-sm-2' >
          <p>Sales Stats</p>
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
          />
        </div>
        <div className='col-sm-2 text-center'>
          <Radio
            className='smallcheck'
            name='radio-button-demo'
            aria-label='B'
            checked
          />
        </div>
      </div>
    </div>
  </form>
)

export default NotificationDetail
