import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

import FormModel from '../../../../../../components/FormModel/index'
import Input from '../../../../../../components/Input'
import CustomInput from '../../../../../../components/InputAdorment'
import Select from '../../../../../../components/Select'
import SaveInline from '../../../../../../components/InlineBars/SaveInline'
import AdelleCharlesImage from '../../../../../../assets/images/avatars/g1.jpg'
import SnackBar from '../../../../../../components/Snackbar'
import { managers, department, userAccountType, adminAccountType } from '../../../../../DummyData'
import { BlockNavigationComponent } from '../../../../../../components/BlockNavigation'

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

const UserProfileForm = (props) => {
  const {
    classes,
    handleSubmit,
    dirty,
    isSubmitting,
    typeOfUserProfile,
    errors
  } = props
  let accountType
  if (typeOfUserProfile === 'user') {
    accountType = userAccountType
  } else {
    accountType = adminAccountType
  }
  return (
    <form onSubmit={handleSubmit} id='form-user'>
      <BlockNavigationComponent open={dirty && !isSubmitting} />
      <div className='box box-default'>
        <div className='box-header'>
          New User
          <SaveInline
            type='submit'
            disabled={isSubmitting || !dirty}
            title='Save Settings'
          />
        </div>
        <div className='box-divider' />
        <div className='box-body'>
          <div className='container-fluid no-padding'>
            <div className={classes.container} noValidate autoComplete='off'>
              <div className='container'>
                <div className='row userback'>
                  <div className='col-sm-12 text-center '>
                    <img alt='Adelle Charles' src={AdelleCharlesImage} className='avatar img-responsive' />
                  </div>
                </div>
                <div className='box-divider inline' />
                <div className='container'>
                  <div className='row'>
                    <div className='col-sm-6'>
                      <Field
                        name='accountType'
                        label='Account Type'
                        className={classes.textField + ' fullform'}
                        margin='normal'
                        options={accountType}
                        component={Select}
                      />
                    </div>
                    <div className='col-sm-6'>
                      <Field
                        type='text'
                        name='email'
                        label='E-Mail'
                        className={classes.textField + ' fullform'}
                        margin='normal'
                        component={Input}
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-6'>
                      <Field
                        name='department'
                        label='Department'
                        className={classes.textField + ' fullform'}
                        options={department}
                        component={Select}
                        margin='normal'
                      />
                    </div>
                    <div className='col-sm-6'>
                      <Field
                        type='text'
                        name='firstName'
                        label='First Name'
                        className={classes.textField + ' fullform'}
                        margin='normal'
                        component={Input}
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-6'>
                      <Field
                        name='manager'
                        label='Manager'
                        className={classes.textField + ' fullform'}
                        component={Select}
                        options={managers}
                      />
                    </div>
                    <div className='col-sm-6'>
                      <Field
                        type='text'
                        name='lastName'
                        label='Last Name'
                        className={classes.textField + ' fullform'}
                        margin='normal'
                        component={Input}
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-6'>
                      <Field
                        type='text'
                        name='position'
                        label='Position'
                        className={classes.textField + ' fullform'}
                        margin='normal'
                        component={Input}
                      />
                    </div>
                    <div className='col-sm-6'>
                      <Field
                        type='text'
                        name='phoneNumber'
                        label='Phone Number'
                        className={classes.textField + ' fullform'}
                        margin='normal'
                        component={Input}
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-12'>
                      <Field
                        type='text'
                        name='remark'
                        label='Remark'
                        className={classes.textField + ' fullform'}
                        multiline
                        rowsMax='4'
                        margin='normal'
                        component={Input}
                      />
                    </div>

                  </div>
                </div>
                <div className='container'>
                  <div className='row'>
                    <div className='box-header' style={{ marginTop: '20px' }}>Integrations</div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-3'>
                      <Field
                        className='m-2'
                        name='lineChatId'
                        label='Line'
                        iconName='account_circle'
                        component={CustomInput}
                      />
                    </div>
                    {/* <div className='col-sm-3 text-center' style={{ paddingLeft: '20px' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            value=''
                            unchecked
                          />
                        }
                        label='Activate'
                      />
                    </div> */}
                    <div className='col-sm-3'>
                      <Field
                        className='m-2'
                        name='telegramId'
                        label='Telegram'
                        iconName='account_circle'
                        component={CustomInput}
                      />
                    </div>
                    {/* <div className='col-sm-3 text-center' style={{ paddingLeft: '20px' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            value=''
                            unchecked
                          />
                        }
                        label='Activate'
                      />
                    </div> */}
                  </div>
                </div>
                {errors['form'] && <SnackBar
                  message={errors['form']}
                  variant='error'
                />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

class UserProfile extends React.Component {
  render () {
    const { validationSchema, initialValues, submitHandler } = this.props
    return (
      <FormModel
        schema={validationSchema}
        initialValues={initialValues}
        submitHandler={submitHandler}
        component={<UserProfileForm {...this.props} />}
      />
    )
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(UserProfile)
