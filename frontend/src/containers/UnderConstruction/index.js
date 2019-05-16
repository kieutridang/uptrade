import React from 'react'
import './index.scss'

import UnderConstructionImg from '../../assets/images/page-under-construction.png'

const UnderConstruction = () => (
  <React.Fragment>
    <img src={UnderConstructionImg} alt='under-construction' className='under-construction-img' />
  </React.Fragment>
)

export default UnderConstruction
