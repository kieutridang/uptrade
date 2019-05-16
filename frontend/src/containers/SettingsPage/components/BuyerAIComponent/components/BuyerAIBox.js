import React from 'react'
import { Field } from 'formik'
import PropTypes from 'prop-types'

import BoxHeader, { PlusIcon } from '../../boxHeader'
import Select from '../../../../../components/Select'
import Input from '../../../../../components/Input'
import { BlockNavigationComponent } from '../../../../../components/BlockNavigation'
const countryOptions = [
  { text: 'China', value: 'China' },
  { text: 'France', value: 'France' },
  { text: 'Hong Kong', value: 'Hong Kong' },
  { text: 'Canada', value: 'Canada' }
]
const portOptions = [
  { text: 'Marseile', value: 'Marseile' },
  { text: 'Antwerp', value: 'Antwerp' }
]
const style = {
  marginTop: 16,
  marginBottom: 8
}
const BuyAIBox = (props) => {
  const {
    activeEdit,
    handleSubmit,
    handleToggleActiveEdit,
    isSubmitting,
    dirty
  } = props
  return (
    <form onSubmit={handleSubmit} >
      <BlockNavigationComponent open={dirty && !isSubmitting} />
      <div className='box box-default'>
        <BoxHeader
          text='Final goods destination'
          activeEdit={activeEdit}
          handleToggleActiveEdit={() => handleToggleActiveEdit('activeEdit')}
        >
          <PlusIcon handleToggleActiveEdit={handleToggleActiveEdit} />
        </BoxHeader>
        <div className='box-body'>
          <div className='container'>
            <div className='row titlerow'><h5 className='inboxtitle'>Import</h5></div>
            <div className='row' style={style}>
              <div className='col-sm-4'>
                <Field
                  type='text'
                  name='country'
                  label='Country'
                  component={Select}
                  disabled={!activeEdit}
                  options={countryOptions}
                />
              </div>
              <div className='col-sm-4'>
                <Field
                  type='text'
                  name='port'
                  label='Port'
                  component={Select}
                  disabled={!activeEdit}
                  options={portOptions}
                />
              </div>
            </div>
            <div className='row titlerow'><h5 className='inboxtitle'>Warehouse #1</h5></div>
            <div className='row' style={style}>
              <div className='col-sm-4'>
                <Field
                  type='text'
                  name='name'
                  label='Name'
                  component={Input}
                  disabled={!activeEdit}
                />
              </div>
            </div>
            <div className='row' style={style}>
              <div className='col-sm-4'>
                <Field
                  type='text'
                  name='country'
                  label='Country'
                  component={Select}
                  disabled={!activeEdit}
                  options={countryOptions}
                />
              </div>
              <div className='col-sm-4'>
                <Field
                  type='text'
                  name='port'
                  label='Port'
                  component={Select}
                  disabled={!activeEdit}
                  options={portOptions}
                />
              </div>
            </div>
            <div className='row' style={style}>
              <div className='col-sm-4'>
                <Field
                  type='text'
                  name='roomBuilding'
                  label='Room / Building'
                  component={Input}
                  disabled={!activeEdit}
                />
                <Field
                  type='text'
                  name='district'
                  label='District'
                  component={Input}
                  disabled={!activeEdit}
                />
              </div>
              <div className='col-sm-4'>
                <Field
                  type='text'
                  name='city'
                  label='City'
                  component={Input}
                  disabled={!activeEdit}
                />
                <Field
                  type='text'
                  name='street'
                  label='Street'
                  component={Input}
                  disabled={!activeEdit}
                />
              </div>
              <div className='col-sm-4'>
                <Field
                  type='text'
                  name='postCode'
                  label='Postcode'
                  component={Input}
                  disabled={!activeEdit}
                />
                <Field
                  type='text'
                  name='province'
                  label='Province'
                  component={Input}
                  disabled={!activeEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form >
  )
}

BuyAIBox.propTypes = {
  activeEdit: PropTypes.bool,
  handleSubmit: PropTypes.func,
  handleToggleActiveEdit: PropTypes.func
}

export default BuyAIBox
