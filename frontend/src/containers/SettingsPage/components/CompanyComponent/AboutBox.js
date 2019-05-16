import React from 'react'
import { Field } from 'formik'
import PropTypes from 'prop-types'

import ImageUrl from '../../../../assets/images/dmlpic.png'
import BoxHeader from '../boxHeader'
import Input from '../../../../components/Input'

import './index.scss'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
const AboutForm = props => {
  const {
    viewMode,
    handleSubmit,
    handleToggleViewMode,
    isSubmitting,
    dirty
  } = props
  let activeEdit
  activeEdit = viewMode === 'edit'
  return (
    <form onSubmit={handleSubmit}>
      <BlockNavigationComponent open={dirty && !isSubmitting} />
      <div className='box box-default'>
        <BoxHeader
          text='About'
          disabled={!dirty && isSubmitting}
          activeEdit={activeEdit}
          handleToggleActiveEdit={() =>
            handleToggleViewMode({ name: 'toggleAboutMode', mode: 'edit' })
          }
        />

        <div className='box-body'>
          <div className='row' style={{ padding: '20px' }}>
            <div className='col-sm-6 no-padding'>
              <Field
                type='text'
                name='uptradeID'
                label='Uptrade ID'
                component={Input}
                disabled={!activeEdit}
              />
              <Field
                type='text'
                name='name'
                label='Name'
                component={Input}
                disabled={!activeEdit}
              />
              <Field
                type='text'
                name='fullName'
                label='Full Name'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-6 text-center'>
              <img src={ImageUrl} alt='' style={{ maxWidth: '210px' }} />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

AboutForm.propTypes = {
  activeEdit: PropTypes.bool,
  handleSubmit: PropTypes.func,
  handleToggleActiveEdit: PropTypes.func
}

export default AboutForm
