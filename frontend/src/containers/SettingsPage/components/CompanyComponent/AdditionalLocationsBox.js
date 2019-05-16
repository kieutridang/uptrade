import React, { Component } from 'react'
import { Field, FieldArray } from 'formik'

import BoxHeader, { PlusIcon } from '../boxHeader'
import Select from '../../../../components/Select'
import Input from '../../../../components/Input'

import './index.scss'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'

const optionsLocaltionType = [
  { text: 'WareHouse', value: 'WAREHOUSE' },
  { text: 'ShowRoom', value: 'SHOWROOM' }
]

class AdditionalLocationsForm extends Component {
  addNewLocation = () => {
    let newAdditionalLocations
    const { values } = this.props
    if (values && values.additionalLocations) {
      newAdditionalLocations = [
        ...values.additionalLocations,
        {
          type: '',
          name: '',
          remark: ''
        }
      ]
    } else {
      newAdditionalLocations = [
        {
          type: '',
          name: '',
          remark: ''
        }
      ]
    }
    this.props.setFieldValue('additionalLocations', newAdditionalLocations)
  }
  render () {
    const {
      values,
      viewMode,
      handleSubmit,
      handleToggleViewMode,
      isSubmitting,
      dirty
    } = this.props
    let activeEdit
    activeEdit = viewMode === 'edit'
    return (
      <form onSubmit={handleSubmit}>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <div className='box box-default'>
          <BoxHeader
            text='Additional Locations'
            disabled={!dirty && isSubmitting}
            activeEdit={activeEdit}
            handleToggleActiveEdit={() =>
              handleToggleViewMode({
                name: 'toggleAdditionalLocationsMode',
                mode: 'edit'
              })
            }
          >
            <PlusIcon handleAdd={this.addNewLocation} />
          </BoxHeader>
          <div className='box-body'>
            <FieldArray
              name={`additionalLocations`}
              render={() => (
                <div>
                  {values.additionalLocations &&
                    values.additionalLocations.map((_, index) => (
                      <div className='row' key={index}>
                        <div className='col-sm-4'>
                          <Field
                            name={`additionalLocations[${index}]type`}
                            label='Location Type'
                            component={Select}
                            disabled={!activeEdit}
                            options={optionsLocaltionType}
                          />
                        </div>
                        <div className='col-sm-4'>
                          <Field
                            name={`additionalLocations[${index}]name`}
                            label='Number'
                            component={Input}
                            disabled={!activeEdit}
                          />
                        </div>
                        <div className='col-sm-4'>
                          <Field
                            name={`additionalLocations[${index}]remark`}
                            label='Remark'
                            component={Input}
                            disabled={!activeEdit}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            />
          </div>
        </div>
      </form>
    )
  }
}

export default AdditionalLocationsForm
