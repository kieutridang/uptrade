import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field, FieldArray } from 'formik'

// import ToggleEditSaveAddInline from '../../../../../components/InlineBars/ToggleEditSaveAddInline'
import Input from '../../../../../components/Input'
import { BlockNavigationComponent } from '../../../../../components/BlockNavigation'
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  menu: {
    width: 200
  }
})

class Banking extends React.Component {
  render () {
    const {
      values,
      classes,
      viewMode,
      // handleToggleActiveEdit,
      handleSubmit,
      dirty,
      isSubmitting,
      errors
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
        <div className='box box-default'>
          <div className='box-header'>Banking
            {/* <ToggleEditSaveAddInline
              title='Banking'
              viewMode={viewMode}
              editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeBankingEdit')}
              saveDisabled={isSubmitting || !dirty}
            /> */}
          </div>
          <div className='box-divider' />
          <div className='box-body'>
            <div className='container'>
              <div className='row'>
                <div className='col-sm-4'>
                  <Field
                    label='Default Payment Terms'
                    name='defaultPaymentTerms'
                    className={classes.textField}
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
              </div>
              <FieldArray
                name='bankings'
                render={arrayHelpers => (
                  <div>
                    {values.bankings && values.bankings.map((item, index) => {
                      return (
                        <div className='row' key={index}>
                          <div className='col-sm-3'>
                            <Field
                              label='Bank'
                              name={`bankings[${index}]bank`}
                              className={classes.textField}
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-2'>
                            <Field
                              label='Bank Code'
                              name={`bankings[${index}]bankCode`}
                              className={classes.textField}
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-3'>
                            <Field
                              label='Account Number'
                              name={`bankings[${index}]accountNumber`}
                              className={classes.textField}
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4'>
                            <Field
                              label='Remark'
                              name={`bankings[${index}]remark`}
                              className={classes.textField}
                              component={Input}
                              disabled={!activeEdit}
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
        </div>
        <span className='error-message'>{ errors['form'] }</span>
      </form>
    )
  }
}

Banking.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Banking)
