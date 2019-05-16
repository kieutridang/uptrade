import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import './index.scss'

class ErrorPage extends React.PureComponent {
  render () {
    return (
      <div className='w-100 h-100 error-container'>
        <div>
          <h1 className='text-500 mb-3'>500</h1>
          <h6 className='text-uppercase mb-0 text-black-50'>SORRY, SERVER GOES WRONG</h6>
        </div>
        <div><hr className='m-0' /></div>
        <div>
          <Link className='btn-go-back' to='/'><Button className='text-uppercase mt-3'>GO BACK TO HOME PAGE</Button></Link>
        </div>
      </div>
    )
  }
}

export default ErrorPage
