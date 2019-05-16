import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

import AddInline from '../../../../components/InlineBars/AddInline'
import Select from '../../../../components/Select'
import Input from '../../../../components/Input'
import SupplierSelect from './SupplierCustomizedSelect'
import { statusOptions } from '../../../DummyData'

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
// const factories = [
//   {
//     value: 'Corwin, Erdman and Gerlach',
//     text: 'Corwin, Erdman and Gerlach'
//   },
//   {
//     value: 'Hartmann, Jenkins and Wehner',
//     text: 'Hartmann, Jenkins and Wehner'
//   },
//   {
//     value: 'Flexidy',
//     text: 'Flexidy'
//   }
// ]
// const contactname = [
//   {
//     value: '1',
//     text: 'Mrs. Li'
//   },
//   {
//     value: '2',
//     text: 'John Wu'
//   }
// ]

class TextFields extends React.Component {
  render () {
    const { classes, suppliers } = this.props
    if (suppliers) {
      var suppliersOptions = suppliers && suppliers.map((supplier) => {
        if (supplier && supplier._company && supplier._company.about && supplier._company.about.uptradeID) {
          return {
            value: supplier._id,
            text: supplier._company.about.uptradeID
          }
        } else {
          return {
            value: supplier._id,
            text: ''
          }
        }
      })
    }
    return (
      <div className={`box-body ${classes.container}`}>
        <div className='container-fluid no-padding'>
          <div className='row'>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Supplier Item #'
                name='supplierItemNumber'
                className={classes.textField}
                component={Input}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Supplier'
                name='_id'
                className={classes.textField}
                supplierList={suppliers}
                options={suppliersOptions || []}
                component={SupplierSelect}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Supplier Status'
                name='status'
                disabled
                options={statusOptions || []}
                className={classes.textField}
                component={Select}
              />

            </div>
            {/* <div className='col-sm-4 col-md-3'>
              <Field
                label='Factory / Sub-Contractor'
                name='factorySubcontractor'
                className={classes.textField}
                options={factories}
                component={Select}
              />

            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Contact Name'
                name='contactName'
                className={classes.textField}
                options={contactname}
                component={Select}
              />
            </div> */}
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Contact'
                name='contactPhone'
                className={classes.textField}
                component={Input}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired
}

const TextFields2 = withStyles(styles)(TextFields)

const Supplier = (props) => (
  <article className='article products'>
    <div className='row'>
      <div className='col-sm-12'>
        <div className='box box-default'>
          <div className='box-header'>Supplier
            <AddInline />
          </div>
          <div className='box-divider' />
          <TextFields2 {...props} />
        </div>
      </div>
    </div>
  </article>
)

export default Supplier
