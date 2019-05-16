import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field, FieldArray } from 'formik'

import AddInline from '../../../../components/InlineBars/AddInline'
import Select from '../../../../components/Select'
import FieldTextOnly from '../../../../components/Input/FieldTextOnly'

const style = {
  selectOptions: {
    fontSize: '0.875rem',
    height: '0.9rem'
  }
}
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
    fontSize: '0.875rem'
  },
  menu: {
    width: 200
  }
})

const factories = [
  {
    value: 'Corwin, Erdman and Gerlach',
    text: 'Corwin, Erdman and Gerlach'
  },
  {
    value: 'Hartmann, Jenkins and Wehner',
    text: 'Hartmann, Jenkins and Wehner'
  },
  {
    value: 'Flexidy',
    text: 'Flexidy'
  }
]

class TextFields extends React.Component {
  render () {
    const { classes, suppliers, values } = this.props
    let suppliersData = []
    suppliersData =
      suppliers &&
      suppliers.map((supplier, index) => {
        return {
          value: supplier._id,
          text: supplier._company.about.uptradeID
        }
      })
    return (
      <div className={classes.container}>
        <div className='container-fluid no-padding'>
          <FieldArray
            name='supplier'
            render={arrayHelpers => (
              <div>
                {values.supplier &&
                  values.supplier.map((item, index) => {
                    let supplier = suppliers && suppliers.find(
                      supplier => supplier._id === item._id
                    )
                    return (
                      <div className='row' key={index}>
                        <div className='col-sm-4 col-md-2'>
                          <Field
                            name={`supplier[${index}]_id`}
                            label='Supplier'
                            className={classes.textField}
                            options={suppliersData}
                            component={Select}
                          />
                        </div>
                        <div className='col-sm-4 col-md-2'>
                          <FieldTextOnly
                            label='Status'
                            className='input'
                            placeholder='Status'
                            value={supplier && supplier._company.about.status}
                          />
                        </div>
                        <div className='col-sm-4 col-md-2'>
                          <Field
                            name={`supplier[${index}]name`}
                            label='Factory / Sub-Contractor'
                            className={classes.textField}
                            margin='normal'
                            style={style.selectOptions}
                            options={factories}
                            component={Select}
                          />
                        </div>
                        <div className='col-sm-4 col-md-2'>
                          <FieldTextOnly
                            label='Contact Email'
                            className='input'
                            placeholder='Contact Email'
                            value={supplier && supplier.contactEmail}
                          />
                        </div>
                        <div className='col-sm-4 col-md-2'>
                          <FieldTextOnly
                            label='Contact Phone'
                            className='input'
                            placeholder='Contact Phone'
                            value={supplier && supplier.contactPhone}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          />
        </div>
      </div>
    )
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired
}

const TextFields2 = withStyles(styles)(TextFields)

class Supplier extends React.Component {
  addNewSupplier = () => {
    let newSupplier
    if (this.props.values.supplier) {
      newSupplier = [
        ...this.props.values.supplier,
        {
          _id: '',
          name: ''
        }
      ]
    } else {
      newSupplier = [
        {
          _id: '',
          name: ''
        }
      ]
    }
    this.props.setFieldValue('supplier', newSupplier)
  }
  render () {
    const { supplierDataList, ...rest } = this.props
    return (
      <article className='article products'>
        <div className='row'>
          <div className='col-sm-12'>
            <div className='box box-default'>
              <div className='box-header'>
                Supplier
                <AddInline addHandleClick={this.addNewSupplier} />
              </div>
              <div className='box-divider' />
              <div className='box-body'>
                <TextFields2 suppliers={supplierDataList} {...rest} />
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }
}

export default Supplier
