import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'
import Input from '../../../../../components/Input'
import Select from '../../../../../components/Select'
import CustomizeRadioButton from '../../../../../components/RadioButton/CustomizeRadioButton'
import ToggleEditSaveInline from '../../../../../components/InlineBars/ToggleEditSaveInline'

import { supplierStyles } from '../../../../DummyData'
import { BlockNavigationComponent } from '../../../../../components/BlockNavigation'

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

class Management extends React.Component {
  render () {
    const {
      classes,
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
        <div className='box box-default'>
          <div className='box-header'>Supplier Management
            <ToggleEditSaveInline
              title='Managements'
              viewMode={viewMode}
              editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeManagementEdit')}
              saveDisabled={isSubmitting || !dirty}
            />
          </div>
          <div className='box-divider' />
          <div className='box-body'>
            <div className='container'>
              <div className='row'>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='type'
                    label='Supplier Style'
                    className={classes.textField}
                    margin='normal'
                    options={supplierStyles}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-sm-4'>
                  <Field
                    name='name'
                    label='Overwrite Supplier Name'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4'>
                  <Field
                    name='shareMyProfileDetails'
                    label='Share My Profile Details With Supplier'
                    className={classes.textField}
                    margin='normal'
                    component={CustomizeRadioButton}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4'>
                  <Field
                    name='shareMyUsersDetails'
                    label='Share My Users Details With Supplier'
                    className={classes.textField}
                    margin='normal'
                    component={CustomizeRadioButton}
                    disabled={!activeEdit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

Management.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Management)
