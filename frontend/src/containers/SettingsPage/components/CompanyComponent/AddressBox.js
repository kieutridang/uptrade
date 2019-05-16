import React from 'react'
import { Field } from 'formik'

import BoxHeader from '../boxHeader'
import Select from '../../../../components/Select'
import Input from '../../../../components/Input'

import './index.scss'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'

const countryOptions = [
  { text: 'China', value: 'China' },
  { text: 'France', value: 'France' },
  { text: 'Hong Kong', value: 'Hong Kong' },
  { text: 'Canada', value: 'Canada' }
]

const portOptions = [
  { text: 'Guangzou', value: 'Guangzou' },
  { text: 'Yantian', value: 'Yantian' }
]
const AddressForm = props => {
  const {
    viewMode,
    handleToggleViewMode,
    handleSubmit,
    isSubmitting,
    dirty
  } = props
  let activeEdit

  switch (viewMode) {
    case 'show':
      activeEdit = false
      break
    case 'edit':
      activeEdit = true
      break
    default:
      return null
  }
  return (
    <form onSubmit={handleSubmit}>
      <BlockNavigationComponent open={dirty && !isSubmitting} />
      <div className='box box-default'>
        <BoxHeader
          text='Address'
          disabled={!dirty && isSubmitting}
          activeEdit={activeEdit}
          handleToggleActiveEdit={() =>
            handleToggleViewMode({ name: 'toggleAddressMode', mode: 'edit' })
          }
        />
        <div className='box-body'>
          <div className='row'>
            <div className='col-sm-4'>
              <Field
                name='country'
                label='Country'
                component={Select}
                disabled={!activeEdit}
                options={countryOptions}
              />
            </div>
            <div className='col-sm-4'>
              <Field
                name='defaultExportPort'
                label='Default Export Port'
                component={Select}
                disabled={!activeEdit}
                options={portOptions}
              />
            </div>
            <div className='col-sm-4'>
              <Field
                name='defaultImportPort'
                label='Default Import Port'
                component={Select}
                disabled={!activeEdit}
                options={portOptions}
              />
            </div>
          </div>

          <div className='inbox-title'>English Address</div>
          <div className='no-padding row'>
            <div className='col-sm-4'>
              <Field
                name='englishRoom'
                label='Room / Building'
                component={Input}
                disabled={!activeEdit}
              />
              <Field
                name='englishStreet'
                label='Street'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4'>
              <Field
                name='englishDistrict'
                label='District'
                component={Input}
                disabled={!activeEdit}
              />
              <Field
                name='englishPostCode'
                label='Postcode'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4'>
              <Field
                name='englishCity'
                label='City'
                component={Input}
                disabled={!activeEdit}
              />
              <Field
                name='englishProvince'
                label='Province'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
          </div>
          <div className='inbox-title'>Local Address</div>
          <div className='no-padding row'>
            <div className='col-sm-4'>
              <Field
                name='localRoom'
                label='Room / Building'
                component={Input}
                disabled={!activeEdit}
              />
              <Field
                name='localStreet'
                label='Street'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4'>
              <Field
                name='localDistrict'
                label='District'
                component={Input}
                disabled={!activeEdit}
              />
              <Field
                name='localPostCode'
                label='Postcode'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4'>
              <Field
                name='localCity'
                label='City'
                component={Input}
                disabled={!activeEdit}
              />
              <Field
                name='localProvince'
                label='Province'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
          </div>
          <div className='inbox-title'>Contact</div>
          <div className='no-padding row'>
            <div className='col-sm-4'>
              <Field
                name='website'
                label='Website'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4'>
              <Field
                name='email'
                label='Email'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4'>
              <Field
                name='phone'
                label='Phone'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AddressForm
