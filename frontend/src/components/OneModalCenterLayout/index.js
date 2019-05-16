import React from 'react'
import './index.scss'
import LogoURL from '../../assets/images/logos/transparentlogo.jpg'

const OneModalCenterLayout = ({ children, bottomSection }) => (
  <div id='layout_one-modal'>
    <div className='layout_one-wrapper'>
      <div className='card card-white'>
        <div className='card-content'>
          <section className='logo text-center'>
            <h1><img src={LogoURL} className='logologin' alt='logo transparent' /></h1>
          </section>
          { children }
        </div>
      </div>
      { bottomSection }
    </div>
  </div>
)

export default OneModalCenterLayout
