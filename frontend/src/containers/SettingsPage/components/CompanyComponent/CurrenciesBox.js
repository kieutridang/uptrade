import React, { Component } from 'react'
import { Field, FieldArray } from 'formik'

import BoxHeader, { PlusIcon } from '../boxHeader'
import Select from '../../../../components/Select'
import SingleCheckBox from './components/SingleCheckBox/index'
import DefaultCheckBox from './components/DefaultCheckbox/index'
import Input from '../../../../components/Input'

import './index.scss'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
const currenciesOptions = [
  { text: 'USD', value: 'USD' },
  { text: 'MRD', value: 'MRD' },
  { text: 'HKD', value: 'HKD' },
  { text: 'EUR', value: 'EUR' }
]
class CurrenciesForm extends Component {
  addNewCurrency = () => {
    let newCurrency
    const { values } = this.props
    if (values && values.currencies) {
      newCurrency = [
        ...values.currencies,
        {
          currency: '',
          defaultCurrency: '',
          optionExchangeRate: '',
          exchangeRateToDefaultCurrency: ''
        }
      ]
    } else {
      newCurrency = [
        {
          currency: '',
          defaultCurrency: '',
          optionExchangeRate: '',
          exchangeRateToDefaultCurrency: ''
        }
      ]
    }
    this.props.setFieldValue('currencies', newCurrency)
  }
  changeDefaultCurrency = defaultIndex => {
    const { values, setFieldValue } = this.props
    values.currencies.forEach((_, index) => {
      setFieldValue(
        `currencies[${index}]defaultCurrency`,
        index === defaultIndex
      )
    })
  }
  render () {
    const {
      viewMode,
      values,
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
            text='Currencies'
            disabled={!dirty && isSubmitting}
            activeEdit={activeEdit}
            handleToggleActiveEdit={() =>
              handleToggleViewMode({
                name: 'toggleCurrenciesMode',
                mode: 'edit'
              })
            }
          >
            <PlusIcon handleAdd={this.addNewCurrency} />
          </BoxHeader>
          <div className='box-body'>
            <div className='col-sm-10 offset-1'>
              <div className='callout callout-info infobody'>
                <p>
                  Select the currencies your users will be able to use for
                  products and sales. Two options for calculating the exchange
                  rate:
                  <br />
                  1. ForEx Spot: the exchange rate against your Default currency
                  at the time of the transaction.
                  <br />
                  2. Fixed Rate: you can input the fixed rate against your
                  Default currency.
                  <br />
                </p>
              </div>
            </div>
            <div className='row titlerow'>
              <div className='col-sm-5'>
                <h5 className='inboxtitle'>Currency</h5>
              </div>
              <div className='col-sm-7'>
                <h5 className='inboxtitle'>Exchange Rate</h5>
              </div>
            </div>
            <FieldArray
              name={`currencies`}
              render={() => (
                <div>
                  {values.currencies &&
                    values.currencies.map((_, index) => (
                      <div className='row pt-3' key={index}>
                        <div className='col-sm-3'>
                          <Field
                            name={`currencies[${index}]currency`}
                            label='Select Currency'
                            component={Select}
                            disabled={!activeEdit}
                            options={currenciesOptions}
                          />
                        </div>
                        <div className='col-sm-2 checklabel'>
                          <Field
                            name={`currencies[${index}]defaultCurrency`}
                            label='Default'
                            onChange={() => this.changeDefaultCurrency(index)}
                            color='primary'
                            component={DefaultCheckBox}
                            disabled={!activeEdit}
                          />
                        </div>
                        <div
                          className='col-sm-2 checklabel'
                          style={{ borderLeft: '1px solid grey' }}
                        >
                          <Field
                            name={`currencies[${index}]optionExchangeRate`}
                            label='Spot ForEx'
                            value='FOREX'
                            color='primary'
                            component={SingleCheckBox}
                            disabled={!activeEdit}
                          />
                        </div>
                        <div className='col-sm-2 checklabel'>
                          <Field
                            name={`currencies[${index}]optionExchangeRate`}
                            label='Fixed Rate'
                            value='FIXED'
                            color='primary'
                            component={SingleCheckBox}
                            disabled={!activeEdit}
                          />
                        </div>
                        <div className='col-sm-3'>
                          <Field
                            name={`currencies[${
                              index
                            }]exchangeRateToDefaultCurrency`}
                            label='Exchange rate to USD'
                            component={Input}
                            disabled={
                              !activeEdit ||
                              !(
                                values.currencies[index].optionExchangeRate ===
                                'FIXED'
                              )
                            }
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

export default CurrenciesForm
