import React from 'react'
import { Field } from 'formik'
import Input from '../../../../components/Input'
import Button from '../../../../components/Button'
import UploadFile from '../../../../components/FileUpload'
import APPCONFIG from '../../../../config/AppConfig'

const styles = {
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
  }
}
const Form = (props) => {
  const { handleSubmit, openCreateCustomerMode, errors, setFieldValue, values } = props
  return (
    <form onSubmit={handleSubmit}>
      <div className='row'>
        <div className='col-4'>
          <Field
            name='uptradeID'
            label='Company UptradeID'
            // className={classes.textField}
            margin='normal'
            component={Input}
          />
        </div>
        {
          openCreateCustomerMode &&
          <div className={`col-12`}>
            <div className='row'>
              <div className='col-4'>
                <Field
                  name='name'
                  label='Company Name'
                  // className={classes.textField}
                  margin='normal'
                  component={Input}
                />
                <Field
                  name='fullName'
                  label='Company FullName'
                  // className={classes.textField}
                  margin='normal'
                  component={Input}
                />
                <Field
                  name='contactPhone'
                  label='Contact Phone'
                  // className={classes.textField}
                  margin='normal'
                  component={Input}
                />
              </div>
              <div className='col-4'>
                <Field
                  name='email'
                  label='Admin Email'
                  // className={classes.textField}
                  margin='normal'
                  component={Input}
                />
                <Field
                  name='firstName'
                  label='Admin First Name'
                  // className={classes.textField}
                  margin='normal'
                  component={Input}
                />
                <Field
                  name='lastName'
                  label='Admin Last Name'
                  // className={classes.textField}
                  margin='normal'
                  component={Input}
                />
              </div>
              <div className='col-4 text-center'>
                <div style={styles.logoSub}>
                  <img style={styles.logo} src={values.businessCard} alt='' />
                </div>
                <UploadFile onUploadComplete={(data) => {
                  setFieldValue('businessCard', APPCONFIG.REACT_APP_BACKEND_URL.concat(data.path))
                }} />
              </div>
            </div>
          </div>
        }
      </div>
      <span className='error-message'>{errors['form']}</span>
      <div className={`${openCreateCustomerMode ? 'text-center' : ''} mb-5 mt-2`}>
        <Button type='submit' typeClass='green-button'>Create customer</Button>
      </div>
    </form>
  )
}

export default Form
