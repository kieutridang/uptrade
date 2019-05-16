import React from 'react'

const BoxModel = ({ header, tool, style, children }) => (
  <div className='box box-default'>
    <div className='box-header'>
      {header}
      {tool}
    </div>
    <div className='box-divider' />
    <div className='box-body' style={style}>
      {children}
    </div>
  </div>
)

export default BoxModel
