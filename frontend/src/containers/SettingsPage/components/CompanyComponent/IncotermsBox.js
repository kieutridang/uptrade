import React from 'react'
import { Field } from 'formik'

import BoxHeader from '../boxHeader'
import CheckBox from '../../../../components/CheckBox/CheckboxMultipleChoice'

import './index.scss'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
const IncotermsBoxForm = props => {
  const {
    viewMode,
    handleToggleViewMode,
    handleSubmit,
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
          text='Incoterms'
          disabled={!dirty && isSubmitting}
          activeEdit={activeEdit}
          handleToggleActiveEdit={() =>
            handleToggleViewMode({ name: 'toggleIncotermsMode', mode: 'edit' })
          }
        />
        <div className='box-body'>
          <div className='row'>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='EXW'
                value='exw'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='FCA'
                value='fca'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='FAS'
                value='fas'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='FOB'
                value='fob'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='CFR'
                value='cfr'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='CIF'
                value='cif'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='CPT'
                value='cpt'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='DDP'
                value='ddp'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='DDU'
                value='ddu'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='DAF'
                value='daf'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='DES'
                value='des'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='DEQ'
                value='deq'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='CIP'
                value='cip'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='DAT'
                value='dat'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-2'>
              <Field
                name='incoterms'
                label='DAP'
                value='dap'
                color='primary'
                component={CheckBox}
                disabled={!activeEdit}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default IncotermsBoxForm
