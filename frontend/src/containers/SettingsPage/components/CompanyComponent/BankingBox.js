import React from 'react'
import { Field, FieldArray } from 'formik'

import BoxHeader, { PlusIcon } from '../boxHeader'
import Input from '../../../../components/Input'

import './index.scss'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'

class BankingForm extends React.Component {
  addNewBanking = () => {
    let newBanking
    const { values } = this.props

    if (values && values.bankingInfos) {
      newBanking = [
        ...values.bankingInfos,
        {
          bank: '',
          accountNumber: '',
          remark: '',
          bankCode: ''
        }
      ]
    } else {
      newBanking = [
        {
          bank: '',
          accountNumber: '',
          remark: '',
          bankCode: ''
        }
      ]
    }
    this.props.setFieldValue('bankingInfos', newBanking)
  }
  render () {
    const {
      values,
      viewMode,
      handleToggleViewMode,
      handleSubmit,
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
            text='Banking'
            disabled={!dirty && isSubmitting}
            activeEdit={activeEdit}
            handleToggleActiveEdit={() =>
              handleToggleViewMode({ name: 'toggleBankingMode', mode: 'edit' })
            }
          >
            <PlusIcon handleAdd={this.addNewBanking} />
          </BoxHeader>
          <div className='box-body'>
            <div className='row'>
              <div className='col-sm-4'>
                <Field
                  name={`defaultPaymentTerms`}
                  label='Default Payment Terms'
                  component={Input}
                  disabled={!activeEdit}
                />
              </div>
            </div>
            <FieldArray
              name={`bankingInfos`}
              render={() => (
                <div>
                  {values.bankingInfos &&
                    values.bankingInfos.map((_, index) => (
                      <div className='no-padding row' key={index}>
                        <div className='col-sm-3'>
                          <Field
                            name={`bankingInfos[${index}]bank`}
                            label='Bank'
                            component={Input}
                            disabled={!activeEdit}
                          />
                        </div>
                        <div className='col-sm-2'>
                          <Field
                            name={`bankingInfos[${index}]bankCode`}
                            label='Bank Code'
                            component={Input}
                            disabled={!activeEdit}
                          />
                        </div>
                        <div className='col-sm-3'>
                          <Field
                            name={`bankingInfos[${index}]accountNumber`}
                            label='Account Number'
                            component={Input}
                            disabled={!activeEdit}
                          />
                        </div>
                        <div className='col-sm-4'>
                          <Field
                            name={`bankingInfos[${index}]remark`}
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

export default BankingForm
