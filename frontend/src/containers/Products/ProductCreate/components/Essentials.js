import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field, FieldArray } from 'formik'
import Select from '../../../../components/Select'
import Input from '../../../../components/Input'
import Helper from '../../../../Helper'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: '0.5rem',
    width: '100%',
    fontSize: '0.875rem',
    lineHeight: '1rem'
  },

  menu: {
    width: 200
  }
})

const itemstatus = [
  {
    value: 'SOURCING',
    text: 'Sourcing Product'
  },
  {
    value: 'PERMANENT',
    text: 'Permanent Product'
  }
]

const certificate = [
  {
    value: true,
    text: 'Yes'
  },
  {
    value: false,
    text: 'No'
  }
]

const brand = [
  {
    value: 'Econazole Nitrate',
    text: 'Econazole Nitrate'
  },
  {
    value: 'Samsung',
    text: 'Samsung'
  }
]

class TextFields extends React.Component {
  renderCustomFields = (customFields) => {
    let newCustomFields
    if (customFields) {
      newCustomFields = customFields.map(item => {
        return {
          fieldName: item,
          value: ''
        }
      })
    }
    if (newCustomFields && newCustomFields.length > 0) {
      return (
        <FieldArray
          name='customFields'
          render={arrayHelpers => {
            return newCustomFields.map((item, index) => {
              return (
                <div className='col-sm-4 col-md-3' key={`customField-${index}`}>
                  <Field
                    key={`customField-${index}`}
                    label={item.fieldName}
                    name={`customFields.[${index}].${item.fieldName}`}
                    component={Input}
                  />
                </div>
              )
            })
          }}
        />
      )
    }
  }
  render () {
    const { classes, values, categoryDataList } = this.props
    let categoriesData = []
    if (categoryDataList && categoryDataList.length > 0) {
      categoriesData = categoryDataList
    }
    const categoryOptionsArray = categoriesData.map(item => { return item.category })
    const categoryOptions = Helper.createOptionsOfSelect(categoryOptionsArray)
    let subCategoryOptions = []
    let customFields = []
    if (values) {
      const category = values.category
      const currentCategory = categoriesData.filter(item => {
        return item.category === category
      })
      if (currentCategory && currentCategory.length > 0) {
        const subCategoryOptionsArray = currentCategory[0].subCategory
        subCategoryOptions = Helper.createOptionsOfSelect(subCategoryOptionsArray)
        customFields = currentCategory[0].customFields
      }
    }
    return (
      <div className={classes.container}>
        <div className='container-fluid no-padding'>
          <div className='row'>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Item Status'
                name='itemStatus'
                className={classes.textField}
                options={itemstatus}
                component={Select}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Category'
                name='category'
                className={classes.textField}
                options={categoryOptions}
                component={Select}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Sub Category'
                name='subCategory'
                className={classes.textField}
                options={subCategoryOptions}
                component={Select}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Brand'
                name='brand'
                className={classes.textField}
                options={brand}
                component={Select}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Item #'
                name='essentialsItemNumber'
                className={classes.textField}
                component={Input}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Item Name'
                name='itemName'
                className={classes.textField}
                component={Input}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='MOQ'
                name='MOQ'
                type='number'
                className={classes.textField}
                component={Input}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Test / Certificate'
                name='testCertificate'
                className={classes.textField}
                options={certificate}
                component={Select}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Form A / E'
                name='formAE'
                className={classes.textField}
                component={Input}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Leadtime'
                name='leadTime'
                className={classes.textField}
                component={Input}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Sample cost'
                name='sampleCost'
                type='number'
                step='0.01'
                className={classes.textField}
                component={Input}
              />
            </div>
            <div className='col-sm-4 col-md-3'>
              <Field
                label='Sample Leadtime'
                name='sampleLeadTime'
                className={classes.textField}
                component={Input}
              />
            </div>
            {this.renderCustomFields(customFields)}
          </div>
        </div>
      </div>
    )
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired
}

const TextFields1 = withStyles(styles)(TextFields)

const Essentials = (props) => {
  return (
    <article className='article products closebox' id='product-essentials-form'>
      <div className='row'>
        <div className='col-sm-12'>
          <div className='box box-default'>
            <div className='box-header'>Essentials
            </div>
            <div className='box-divider' />
            <div className='box-body'>
              <TextFields1 {...props} />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default Essentials
