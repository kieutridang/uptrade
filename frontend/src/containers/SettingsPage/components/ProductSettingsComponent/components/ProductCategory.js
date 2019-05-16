import React from 'react'
import {
  Grid,
  List
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Field, FieldArray } from 'formik'
import Title from './Title'
import Category from './Category'
import ToggleEditSaveInline from '../../../../../components/InlineBars/ToggleEditSaveInline'
import Input from '../../../../../components/Input'

const styles = {
  header: {
    'font-size': '0.875rem',
    'font-weight': '700',
    paddingBottom: 12
  },
  productSettings: {
    padding: '20px'
  },
  formWrapper: {
    paddingTop: '20px'
  },
  show: {
    display: 'block'
  },
  hide: {
    display: 'none'
  }
}

class ProductCategory extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeProductSettingsIndex: 0
    }
  }
  renderSubCategories = (activeEdit) => {
    const { values } = this.props
    const { activeProductSettingsIndex } = this.state
    const productSettings = values.productSettings
    if (productSettings && productSettings.length > 0) {
      const currentProductSettings = productSettings.filter((item, index) => {
        return index === activeProductSettingsIndex
      })
      if (currentProductSettings && currentProductSettings.length > 0) {
        const currentSubCategories = currentProductSettings[0].subCategory
        if (currentSubCategories && currentSubCategories.length > 0) {
          return (
            <FieldArray
              name='categories'
              render={arrayHelpers => {
                return currentSubCategories.map((item, index) => {
                  return (
                    <Category
                      title={item}
                      type='sub-category'
                      key={`subCategory-${activeProductSettingsIndex}-${index}`}
                      name={`productSettings.[${activeProductSettingsIndex}].subCategory.[${index}]`}
                      disabled={!activeEdit}
                      handleRemove={() => this.handleRemoveSubCategory(activeProductSettingsIndex, index)}
                    />
                  )
                })
              }}
            />
          )
        }
      }
    }
  }
  renderCustomFields = (activeEdit) => {
    const { values } = this.props
    const { activeProductSettingsIndex } = this.state
    const productSettings = values.productSettings
    if (productSettings && productSettings.length > 0) {
      const currentProductSettings = productSettings.filter((item, index) => {
        return index === activeProductSettingsIndex
      })
      if (currentProductSettings && currentProductSettings.length > 0) {
        const currentCustomFields = currentProductSettings[0].customFields
        if (currentCustomFields && currentCustomFields.length > 0) {
          return (
            <FieldArray
              name='productSettings'
              render={arrayHelpers => {
                return currentCustomFields.map((item, index) => {
                  return (
                    <Field
                      key={`customField-${index}`}
                      label={`Custom field #${index + 1}`}
                      name={`productSettings.[${activeProductSettingsIndex}].customFields.[${index}]`}
                      component={Input}
                      disabled={!activeEdit}
                    />
                  )
                })
              }}
            />
          )
        }
      }
    }
  }
  handleActiveCategory = (index) => {
    this.setState({
      activeProductSettingsIndex: index
    })
  }
  handleAddNewEntry = (name, activeProductSettingsIndex = null) => {
    const { values } = this.props
    if (name === 'category') {
      let newCategory
      if (values.productSettings) {
        newCategory = [
          ...values.productSettings,
          {
            category: '',
            subCategory: [],
            customFields: []
          }
        ]
      } else {
        newCategory = [
          {
            category: '',
            subCategory: [],
            customFields: []
          }
        ]
      }
      this.props.setFieldValue('productSettings', newCategory)
    } else if (name === 'sub-category') {
      let newSubCategory
      if (values.productSettings) {
        const currentCategory = values.productSettings.filter((item, index) => {
          return index === activeProductSettingsIndex
        })
        if (currentCategory && currentCategory.length > 0) {
          const currrentSubCategories = currentCategory[0].subCategory
          if (currrentSubCategories) {
            newSubCategory = [
              ...currrentSubCategories,
              ''
            ]
          } else {
            newSubCategory = ['']
          }
        }
      }
      this.props.setFieldValue(`productSettings[${activeProductSettingsIndex}].subCategory`, newSubCategory)
    } else {
      let newCustomField
      if (values.productSettings) {
        const currentCategory = values.productSettings.filter((item, index) => {
          return index === activeProductSettingsIndex
        })
        if (currentCategory && currentCategory.length > 0) {
          const currrentCustomField = currentCategory[0].customFields
          if (currrentCustomField && currrentCustomField.length > 0) {
            newCustomField = [
              ...currrentCustomField,
              ''
            ]
          } else {
            newCustomField = ['']
          }
        }
      }
      this.props.setFieldValue(`productSettings[${activeProductSettingsIndex}].customFields`, newCustomField)
    }
  }
  handleRemoveSubCategory = (indexOfCategory, indexOfSubCategory) => {
    const productSettings = this.props.values.productSettings
    if (productSettings) {
      const currentCategory = productSettings.filter((item, index) => {
        return index === indexOfCategory
      })
      if (currentCategory && currentCategory.length > 0) {
        const subCategory = currentCategory[0].subCategory
        const newSubCategory = subCategory.filter((item, index) => {
          return index !== indexOfSubCategory
        })
        this.props.setFieldValue(`productSettings[${indexOfCategory}].subCategory`, newSubCategory)
      }
    }
  }
  renderErrorMessage = (name, errors, touched) => {
    let currentError
    const errorsProductSettings = errors.productSettings
    switch (name) {
      case 'category':
        if (errorsProductSettings) {
          currentError = errorsProductSettings.filter(item => {
            return item && item.category && item.category.length > 0
          })
        }
        break
      case 'subCategory': {
        if (errorsProductSettings) {
          currentError = errorsProductSettings.filter(item => {
            return item && item.subCategory && item.subCategory.length > 0
          })
        }
        break
      }
      case 'customFields': {
        if (errorsProductSettings) {
          currentError = errorsProductSettings.filter(item => {
            return item && item.customFields && item.customFields.length > 0
          })
        }
        break
      }
      default: return {}
    }
    if (currentError && currentError.length > 0) {
      return (
        <span className='error-message'>{currentError[0][`${name}`]}</span>
      )
    }
  }
  render () {
    const {
      classes,
      viewMode,
      handleToggleActiveEdit,
      handleSubmit,
      dirty,
      isSubmitting,
      values,
      touched,
      errors
    } = this.props
    const { activeProductSettingsIndex } = this.state
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
    let iconOfCustomFields = 'add'
    let textOfCustomField = 'Add'
    const activeProductSettings = values.productSettings.filter((item, index) => {
      return index === activeProductSettingsIndex
    })
    if (activeProductSettings && activeProductSettings.length > 0 && activeProductSettings[0].customFields && activeProductSettings[0].customFields.length > 1) {
      iconOfCustomFields = 'check'
      textOfCustomField = 'Save'
    }
    return (
      <form onSubmit={handleSubmit}>
        <div className='box box-default'>
          <div className='box-header'>
            Product Categories
            <ToggleEditSaveInline
              title='Product Settings'
              viewMode={viewMode}
              editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeProductSettingsEdit')}
              saveDisabled={isSubmitting || !dirty}
            />
          </div>
          <div className='box-divider' />
          <div className='box-body'>
            <Grid
              container
              direction='row'
              justify='space-between'
              alignItems='flex-start'
              spacing={32}
              className={classes.formWrapper}
            >
              <Grid item xs={4}>
                <Title
                  title='Categories'
                  icon='add'
                  text='Add Entry'
                  handleAddNewEntry={() => { this.handleAddNewEntry('category') }}
                  addDisabled={!activeEdit}
                />
                <List>
                  <FieldArray
                    name='productSettings'
                    render={arrayHelpers => {
                      return values.productSettings.map((item, index) => {
                        return <Category
                          title={item.category}
                          type='category'
                          key={`category-${index}`}
                          name={`productSettings.[${index}].category`}
                          disabled={!activeEdit}
                          active={index === activeProductSettingsIndex}
                          handleActiveCategory={() => this.handleActiveCategory(index)}
                          handleRemove={() => arrayHelpers.remove(index)}
                        />
                      })
                    }}
                  />
                  {errors && this.renderErrorMessage('category', errors, touched)}
                </List>
              </Grid>
              <Grid item xs={4}>
                <Title
                  title='Sub-Categories'
                  icon='add' text='Add Entry'
                  handleAddNewEntry={() => { this.handleAddNewEntry('sub-category', activeProductSettingsIndex) }}
                  addDisabled={!activeEdit}
                />
                <List>
                  {this.renderSubCategories(activeEdit)}
                  {errors && this.renderErrorMessage('subCategory', errors, touched)}
                </List>

              </Grid>
              <Grid item xs={4}>
                <Title
                  title='Custom Fields'
                  icon={iconOfCustomFields}
                  primaryIcon
                  text={textOfCustomField}
                  handleAddNewEntry={() => { this.handleAddNewEntry('customField', activeProductSettingsIndex) }}
                  addDisabled={!activeEdit}
                />
                {this.renderCustomFields(activeEdit)}
                {errors && this.renderErrorMessage('customFields', errors, touched)}
              </Grid>
            </Grid>
          </div>
        </div>
      </form>
    )
  }
}

export default withStyles(styles)(ProductCategory)
