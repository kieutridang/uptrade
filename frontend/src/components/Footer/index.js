import React from 'react'
import { Link } from 'react-router-dom'
import APPCONFIG from '../../config/AppConfig'

class Footer extends React.Component {
  render () {
    return (
      <section className='app-footer'>
        <div className='container-fluid'>
          <span className='float-left'>
            <span>Copyright © <Link className='brand' to=''>{APPCONFIG.brand}</Link> {APPCONFIG.year}</span>
          </span>
          <span className='float-right'>
            <span>{APPCONFIG.version}</span>
          </span>
        </div>
      </section>
    )
  }
}

export default Footer
