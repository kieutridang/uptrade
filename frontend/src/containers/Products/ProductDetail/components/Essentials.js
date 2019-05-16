import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field, FieldArray } from 'formik'

import Input from '../../../../components/Input'
import Select from '../../../../components/Select'
import ToggleEditSaveInline from '../../../../components/InlineBars/ToggleEditSaveInline'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
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

const statusOptions = [
  {
    value: 'SOURCING',
    text: 'SOURCING'
  },
  {
    value: 'PERMANENT',
    text: 'PERMANENT'
  }
]

const certificateOptions = [
  {
    value: true,
    text: 'Yes'
  },
  {
    value: false,
    text: 'No'
  }
]

const brandOptions = [
  {
    value: 'Econazole Nitrate',
    text: 'Econazole Nitrate'
  },
  {
    value: 'Samsung',
    text: 'Samsung'
  }
]
class Essentials extends React.Component {
  renderCustomFields = (customFields, activeEdit) => {
    const { values } = this.props
    let currentCustomFields = []
    let customFieldsOfProduct = []
    if (customFields) {
      customFieldsOfProduct = values.customFields || []
      const newCustomFields = customFields.map(item => {
        return {
          fieldName: item,
          value: ''
        }
      })
      newCustomFields.forEach(element => {
        let currentCustomField = element
        customFieldsOfProduct.forEach(itemOfProduct => {
          if (itemOfProduct.fieldName === element.fieldName) {
            currentCustomField = itemOfProduct
          }
        })
        currentCustomFields.push(currentCustomField)
      })
    }
    if (currentCustomFields && currentCustomFields.length > 0) {
      return (
        <FieldArray
          name='customFields'
          render={arrayHelpers => {
            return currentCustomFields.map((item, index) => {
              return (
                <div className='col-sm-4 col-md-3' key={`customField-${index}`}>
                  <Field
                    key={`customField-${index}`}
                    label={item.fieldName}
                    name={`customFields.[${index}].value`}
                    component={Input}
                    disabled={!activeEdit}
                    onChange={(event) => {
                      const newCustomFields = currentCustomFields
                      newCustomFields[index] = { fieldName: item.fieldName, value: event.target.value }
                      arrayHelpers.form.setFieldValue('customFields', newCustomFields)
                      arrayHelpers.form.setTouched('customFields', true)
                    }}
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
    const {
      classes,
      viewMode,
      handleToggleActiveEdit,
      handleSubmit,
      values,
      dirty,
      isSubmitting,
      errors,
      touched,
      categoryDataList
    } = this.props
    let activeEdit
    switch (viewMode) {
      case 'show':
        activeEdit = false
        break
      case 'edit':
        activeEdit = true
        break
      default: return null
    }
    let categoriesData = []
    if (categoryDataList && categoryDataList.length > 0) {
      categoriesData = categoryDataList
    }
    const categoryOptionsArray = categoriesData.map(item => { return item.category })
    const categoryOptions = Helper.createOptionsOfSelect(categoryOptionsArray)
    const category = values.category
    const currentCategoryArray = categoriesData.filter(item => {
      return item.category === category
    })
    let subcategoryOptions = []
    let customFields = []
    if (currentCategoryArray && currentCategoryArray.length > 0) {
      const subCategoryOptionsArrray = currentCategoryArray[0].subCategory
      subcategoryOptions = Helper.createOptionsOfSelect(subCategoryOptionsArrray)
      customFields = currentCategoryArray[0].customFields
    }
    return (
      <form onSubmit={handleSubmit} id='product-detail-essentials-form'>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <article className='article products closebox'>
          <div className='row'>
            <div className='col-sm-12'>
              <div className='box box-default'>
                <div className='box-header'>Essentials
                  <ToggleEditSaveInline
                    title='Essentials'
                    viewMode={viewMode}
                    editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeEssentialsEdit')}
                    saveDisabled={isSubmitting || !touched}
                  />
                </div>
                <div className='box-divider' />
                <div className={`box-body ${classes.container}`}>
                  <div className='container-fluid no-padding'>
                    <div className='row'>
                      <div className='col-sm-4 col-md-3'>
                        <Field
                          name='itemStatus'
                          label='Item Status'
                          className={classes.textField}
                          margin='normal'
                          options={statusOptions}
                          component={Select}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-sm-4 col-md-3'>
                        <Field
                          name='category'
                          label='Category'
                          className={classes.textField}
                          margin='normal'
                          options={categoryOptions}
                          component={Select}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-sm-4 col-md-3'>
                        <Field
                          name='subCategory'
                          label='Sub Category'
                          className={classes.textField}
                          margin='normal'
                          options={subcategoryOptions}
                          component={Select}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-sm-4 col-md-3'>
                        <Field
                          name='brand'
                          label='Brand'
                          className={classes.textField}
                          margin='normal'
                          options={brandOptions}
                          component={Select}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-sm-4 col-md-3'>
                        <Field
                          name='itemNumber'
                          label='Item #'
                          className={classes.textField}
                          margin='normal'
                          component={Input}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-sm-4 col-md-3'>
                        <Field
                          name='itemName'
                          label='Item Name'
                          className={classes.textField}
                          margin='normal'
                          component={Input}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-sm-4 col-md-3'>
                        <Field
                          name='MOQ'
                          label='MOQ'
                          type='number'
                          className={classes.textField}
                          margin='normal'
                          component={Input}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-sm-4 col-md-3'>
                        <Field
                          name='testCertificate'
                          label='Test / Certificate'
                          className={classes.textField}
                          margin='normal'
                          options={certificateOptions}
                          component={Select}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-sm-4 col-md-3'>
                        <Field
                          name='formAE'
                          label='Form A / E'
                          className={classes.textField}
                          margin='normal'
                          component={Input}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-sm-4 col-md-3'>
                        <Field
                          name='leadTime'
                          label='Leadtime'
                          className={classes.textField}
                          margin='normal'
                          component={Input}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-sm-4 col-md-3'>
                        <Field
                          name='sampleCost'
                          label='Sample cost'
                          type='number'
                          step='0.01'
                          className={classes.textField}
                          margin='normal'
                          component={Input}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-sm-4 col-md-3'>
                        <Field
                          name='sampleLeadTime'
                          label='Sample Leadtime'
                          className={classes.textField}
                          margin='normal'
                          component={Input}
                          disabled={!activeEdit}
                        />
                      </div>
                      {this.renderCustomFields(customFields, activeEdit)}
                    </div>
                  </div>
                </div>
                <span className='error-message'>{ errors['form'] }</span>
              </div>
            </div>
          </div>
        </article>
      </form>
    )
  }
}

Essentials.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Essentials)
