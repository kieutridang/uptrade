import React from 'react'
import { Field, FieldArray } from 'formik'
import Typography from '@material-ui/core/Typography'
import Input from '../../../../components/InputTable'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
import ToggleEditSaveAddInline from '../../../../components/InlineBars/ToggleEditSaveAddInline'
export default class Cost extends React.Component {
  addNewRowCost = () => {
    let newProductCost
    if (this.props.values.cost) {
      newProductCost = [
        ...this.props.values.cost.productsCost,
        {
          type: 'Product Cost',
          supplier: '',
          quantity: 1,
          currency: '',
          cost: 1,
          update: ''
        }
      ]
    } else {
      newProductCost = [
        {
          type: 'Product Cost',
          supplier: '',
          quantity: 1,
          currency: '',
          cost: 1,
          update: ''
        }
      ]
    }
    this.props.setFieldValue('cost.productsCost', newProductCost)
  }
  componentWillUpdate (nextProps) {
    if (nextProps.values.cost) {
      const stringOfNextProductCost = JSON.stringify(nextProps.values.cost.productsCost)
      const stringOfCurrentProductCost = this.props.values.cost ? JSON.stringify(this.props.values.cost.productsCost) : null
      if (stringOfNextProductCost !== stringOfCurrentProductCost) {
        const { values, setFieldValue } = nextProps
        let totalCost = 0
        let currency
        if (values.cost && values.cost.productsCost) {
          totalCost = values.cost.productsCost.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.cost
          }, 0)
          currency = values.cost.productsCost[0].currency
        }
        let newTotalProductCost = values.cost.totalProductCost || {}
        newTotalProductCost.cost = totalCost
        newTotalProductCost.currency = currency
        setFieldValue('cost.totalProductCost', newTotalProductCost)
      }
    }
  }

  render () {
    const {
      values,
      viewMode,
      handleToggleActiveEdit,
      handleSubmit,
      dirty,
      isSubmitting
    } = this.props
    let activeEdit
    switch (viewMode) {
      case 'show':
        activeEdit = false
        break
      case 'edit':
        activeEdit = true
        break
      default:
        activeEdit = false
        break
    }
    return (
      <form onSubmit={handleSubmit}>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <article className='article'>
          <div className='row'>
            <div className='col-sm-12'>
              <div className='box box-default table-box mdl-shadow--2dp'>
                <div className='box-header'>Cost
                  <ToggleEditSaveAddInline
                    title='Cost'
                    viewMode={viewMode}
                    editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeCostEdit')}
                    saveDisabled={isSubmitting || !dirty}
                    addClickHandler={() => { this.addNewRowCost() }}
                  />
                </div>
                <table className='mdl-data-table' style={{ borderRight: '0px' }}>
                  <thead>
                    <tr>
                      <th className='mdl-data-table__cell--non-numeric'>Type</th>
                      <th className='mdl-data-table__cell--non-numeric'>Supplier</th>
                      <th className=''>MOQ</th>
                      <th className='mdl-data-table__cell--non-numeric'>Currency</th>
                      <th className=''>Cost</th>
                      <th className='mdl-data-table__cell--non-numeric'>Update</th>
                    </tr>
                  </thead>
                  <FieldArray
                    name='cost'
                    render={arrayHelpers => (
                      <tbody>
                        {values.cost && values.cost.productsCost && values.cost.productsCost.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td className='mdl-data-table__cell--non-numeric'>
                                <Field
                                  name={`cost.productsCost.[${index}]type`}
                                  component={Input}
                                  disabled
                                />
                              </td>
                              <td className='mdl-data-table__cell--non-numeric'>
                                <Field
                                  name={`cost.productsCost.[${index}]supplier`}
                                  component={Input}
                                  disabled={!activeEdit}
                                />
                              </td>
                              <td className='mdl-data-table__cell--non-numeric'>
                                <Field
                                  name={`cost.productsCost.[${index}]quantity`}
                                  type='number'
                                  component={Input}
                                  disabled={!activeEdit}
                                />
                              </td>
                              <td className='mdl-data-table__cell--non-numeric'>
                                <Field
                                  name={`cost.productsCost.[${index}]currency`}
                                  component={Input}
                                  disabled={!activeEdit}
                                />
                              </td>
                              <td className='mdl-data-table__cell--non-numeric'>
                                <Field
                                  type='number'
                                  name={`cost.productsCost.[${index}]cost`}
                                  component={Input}
                                  disabled={!activeEdit}
                                />
                              </td>
                              <td className='mdl-data-table__cell--non-numeric'>
                                <Field
                                  name={`cost.productsCost.[${index}]update`}
                                  component={Input}
                                  disabled={!activeEdit}
                                />
                              </td>
                            </tr>
                          )
                        }
                        )}
                        <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}>
                          <td className='mdl-data-table__cell--non-numeric'>
                            <Typography className='text-dark' variant='caption'>Total Product Cost</Typography>
                          </td>
                          <td className='mdl-data-table__cell--non-numeric' />
                          <td className='mdl-data-table__cell--non-numeric' />
                          <td className='mdl-data-table__cell--non-numeric'>
                            <Field
                              name={`cost.totalProductCost.currency`}
                              component={Input}
                              disabled
                            />
                          </td>
                          <td className='mdl-data-table__cell--non-numeric'>
                            <Field
                              type='number'
                              name={`cost.totalProductCost.cost`}
                              component={Input}
                              disabled
                            />
                          </td>
                          <td className='mdl-data-table__cell--non-numeric' />
                        </tr>
                        <tr>
                          <td className='mdl-data-table__cell--non-numeric'>
                            <Typography className='text-dark' variant='caption'>Reco. Selling Price</Typography>
                          </td>
                          <td className='mdl-data-table__cell--non-numeric' />
                          <td className='mdl-data-table__cell--non-numeric' />
                          <td className='mdl-data-table__cell--non-numeric'>
                            <Field
                              name={`cost.recoSellingPrice.currency`}
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </td>
                          <td className='mdl-data-table__cell--non-numeric'>
                            <Field
                              type='number'
                              name={`cost.recoSellingPrice.cost`}
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </td>
                          <td className='mdl-data-table__cell--non-numeric' />
                        </tr>
                        <tr>
                          <td className='mdl-data-table__cell--non-numeric'>
                            <Typography className='text-dark' variant='caption'>Retail Reco. Price</Typography>
                          </td>
                          <td className='mdl-data-table__cell--non-numeric' />
                          <td className='mdl-data-table__cell--non-numeric' />
                          <td className='mdl-data-table__cell--non-numeric'>
                            <Field
                              name={`cost.retailRecoPrice.currency`}
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </td>
                          <td className='mdl-data-table__cell--non-numeric'>
                            <Field
                              type='number'
                              name={`cost.retailRecoPrice.cost`}
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </td>
                          <td className='mdl-data-table__cell--non-numeric' />
                        </tr>
                        <tr>
                          <td className='mdl-data-table__cell--non-numeric'>
                            <Typography className='text-dark' variant='caption'>Market Place Price</Typography>
                          </td>
                          <td className='mdl-data-table__cell--non-numeric' />
                          <td className='mdl-data-table__cell--non-numeric' />
                          <td className='mdl-data-table__cell--non-numeric'>
                            <Field
                              name={`cost.marketPlacePrice.currency`}
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </td>
                          <td className='mdl-data-table__cell--non-numeric'>
                            <Field
                              type='number'
                              name={`cost.marketPlacePrice.cost`}
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </td>
                          <td className='mdl-data-table__cell--non-numeric' />
                        </tr>
                      </tbody>
                    )}
                  />
                </table>
              </div>
            </div>
          </div>
        </article>
      </form>
    )
  }
}
