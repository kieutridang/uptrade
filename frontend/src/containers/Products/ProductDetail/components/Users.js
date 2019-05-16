import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

import ToggleEditSaveInline from '../../../../components/InlineBars/ToggleEditSaveInline'
import Select from '../../../../components/Select'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
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

class Users extends React.Component {
  render () {
    const {
      classes,
      viewMode,
      handleToggleActiveEdit,
      handleSubmit,
      dirty,
      isSubmitting,
      errors,
      users
    } = this.props
    let activeEdit
    let usersOptions = []
    usersOptions = users && users.map(user => ({ value: user._id, text: `${user.firstName} ${user.lastName}` }))

    switch (viewMode) {
      case 'show':
        activeEdit = false
        break
      case 'edit':
        activeEdit = true
        break
      default: return null
    }
    return (
      <form onSubmit={handleSubmit}>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <article className='article'>
          <div className='row'>
            <div className='col-sm-12'>
              <div className='box box-default table-box mdl-shadow--2dp'>
                <div className='box-header'>
                  Users
                  <ToggleEditSaveInline
                    title='Edit Supplier'
                    viewMode={viewMode}
                    editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeUsersEdit')}
                    saveDisabled={isSubmitting || !dirty}
                  />
                </div>
                <div className='box-divider' />
                <div className={`box-body ${classes.container}`}>
                  <div className='container-fluid no-padding'>
                    <div className='row'>
                      <div className='col-3'>
                        <Field
                          label='Product Manager'
                          name={`productManager`}
                          className={classes.textField}
                          options={usersOptions}
                          component={Select}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-3'>
                        <Field
                          label='Procurement Manager'
                          name={`procurementManager`}
                          className={classes.textField}
                          options={usersOptions}
                          component={Select}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-3'>
                        <Field
                          label='Quality Manager'
                          name={`qualityManager`}
                          className={classes.textField}
                          options={usersOptions}
                          component={Select}
                          disabled={!activeEdit}
                        />
                      </div>
                      <div className='col-3'>
                        <Field
                          label='Marketing Manager'
                          name={`marketingManager`}
                          className={classes.textField}
                          options={usersOptions}
                          component={Select}
                          disabled={!activeEdit}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
        <span className='error-message'>{ errors['form'] }</span>
      </form>
    )
  }
}

Users.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Users)
