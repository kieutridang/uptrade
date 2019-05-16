import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

import CustomizeRadioButton from '../../../../components/RadioButton/CustomizeRadioButton'
import Input from '../../../../components/Input'
import ToggleEditSaveInline from '../../../../components/InlineBars/ToggleEditSaveInline'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'

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

class Standards extends React.Component {
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
          <div className='box-header'>Standards
            <ToggleEditSaveInline
              title='Standards'
              viewMode={viewMode}
              editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeAboutEdit')}
              saveDisabled={isSubmitting || !dirty}
            />
          </div>
          <div className='box-divider' />
          <div className='box-body'>
            <div className='container'>
              <div className='row'>
                <div className='col-sm-4 col-md-3 col-lg-3' style={{ paddingTop: '16px' }}>
                  <Field
                    name='shareMyUsersDetails'
                    label='Internal Factory Audit'
                    className={classes.textField}
                    margin='normal'
                    component={CustomizeRadioButton}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-3' style={{ paddingTop: '16px' }}>
                  <Field
                    name='shareMyUsersDetails'
                    label='Pre-Production Sample'
                    className={classes.textField}
                    margin='normal'
                    component={CustomizeRadioButton}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-3' style={{ paddingTop: '16px' }}>
                  <Field
                    name='shareMyUsersDetails'
                    label='Packaging Sample'
                    className={classes.textField}
                    margin='normal'
                    component={CustomizeRadioButton}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-3' style={{ paddingTop: '16px' }}>
                  <Field
                    name='shareMyUsersDetails'
                    label='Pre-Shipment Sample'
                    className={classes.textField}
                    margin='normal'
                    component={CustomizeRadioButton}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-3' style={{ paddingTop: '16px' }}>
                  <Field
                    name='shareMyUsersDetails'
                    label='Inspection'
                    className={classes.textField}
                    margin='normal'
                    component={CustomizeRadioButton}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-3' style={{ paddingTop: '16px' }}>
                  <Field
                    name='shareMyUsersDetails'
                    label='Shipment Samples'
                    className={classes.textField}
                    margin='normal'
                    component={CustomizeRadioButton}
                    disabled={!activeEdit}
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
                  <Field
                    name='shareMyUsersDetails'
                    label='Quality'
                    className={classes.textField}
                    margin='normal'
                    component={CustomizeRadioButton}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-12'>
                  <Field
                    name='name'
                    label='Packaging'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
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

export default withStyles(styles)(Standards)
