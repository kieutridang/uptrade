import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

import FormModel from '../../../../components/FormModel'
import SaveInline from '../../../../components/InlineBars/SaveInline'
import Input from '../../../../components/Input'
import Select from '../../../../components/Select'
import UploadFile from '../../../../components/FileUpload'
import APPCONFIG from '../../../../config/AppConfig'
import { registrationOptions, statusOptions } from '../../../DummyData'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    width: '100%',
    fontSize: '13px',
    marginLeft: '0px',
    marginRight: '0px'
  },
  logoSub: {
    width: 250,
    height: 150,
    border: '1px dashed black',
    margin: 'auto',
    marginBottom: '20px'
  },
  logo: {
    maxWidth: 250,
    maxHeight: 150
  },
  companyLogo: {
    border: '1px dashed black'
  },
  menu: {
    width: '100%'
  }
})

const CompanyForm = (props) => {
  const {
    classes,
    handleSubmit,
    dirty,
    isSubmitting,
    errors,
    values,
    setFieldValue
  } = props
  return (
    <form onSubmit={handleSubmit}>
      <BlockNavigationComponent open={dirty && !isSubmitting} />
      <div className='box box-default'>
        <div className='box-header'>
          Company
          <SaveInline
            type='submit'
            disabled={isSubmitting || !dirty}
            title='Save Settings'
          />
        </div>
        <div className='box-divider' />
        <div className='box-body'>
          <div className={classes.container} >
            <div className='col-sm-6 no-padding'>
              <div className='col-sm-12'>
                <Field
                  name='status'
                  label='Status'
                  className={classes.textField}
                  margin='normal'
                  component={Select}
                  options={statusOptions}
                />
                <Field
                  name='registration'
                  label='Registration'
                  className={classes.textField}
                  margin='normal'
                  component={Select}
                  options={registrationOptions}
                />
                <Field
                  type='number'
                  name='usersLimit'
                  label='Users Limitation'
                  className={classes.textField}
                  margin='normal'
                  component={Input}
                />
                <Field
                  type='text'
                  name='uptradeID'
                  label='Uptrade ID'
                  className={classes.textField}
                  margin='normal'
                  component={Input}
                />
                <Field
                  type='text'
                  name='name'
                  label='Name'
                  className={classes.textField}
                  margin='normal'
                  component={Input}
                />
                <Field
                  type='text'
                  name='fullName'
                  label='Full Name'
                  className={classes.textField + ' fullform'}
                  margin='normal'
                  component={Input}
                />
              </div>
            </div>
            <div className='col-sm-6 text-center'>
              <div className={classes.logoSub}>
                <img className={classes.logo} src={values.logo} alt='' />
              </div>
              <UploadFile onUploadComplete={(data) => {
                setFieldValue('logo', APPCONFIG.REACT_APP_BACKEND_URL.concat(data.path))
              }} />
            </div>
            <span className='error-message'>{ errors['form'] }</span>
          </div>
        </div>
      </div>
    </form>
  )
}

class Company extends React.Component {
  render () {
    const { validationSchema, initialValues, submitHandler } = this.props
    return (
      <FormModel
        schema={validationSchema}
        initialValues={initialValues}
        submitHandler={submitHandler}
        component={<CompanyForm {...this.props} />}
      />
    )
  }
}
Company.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Company)