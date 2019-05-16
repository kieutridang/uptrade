import React from 'react'
import { Link } from 'react-router-dom'

import Button from '../../components/Button'
import './index.scss'

class NotFoundPage extends React.PureComponent {
  render () {
    return (
      <div className='w-100 h-100 not-found-container'>
        <div>
          <h1 className='text-404 mb-3'>404</h1>
          <h6 className='text-uppercase mb-0 text-black-50'>SORRY, PAGE NOT FOUND</h6>
        </div>
        <div><hr className='m-0' /></div>
        <div>
          <Link className='btn-go-back' to='/'><Button className='text-uppercase mt-3'>GO BACK TO HOME PAGE</Button></Link>
        </div>
      </div>
    )
  }
}

export default NotFoundPage
