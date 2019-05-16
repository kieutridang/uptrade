import React, { Component } from 'react'
import { Field } from 'formik'
import * as Yup from 'yup'

import FormModel from '../../../components/FormModel'
import Input from '../../../components/Input'
import Textarea from '../../../components/Textarea'
import Select from '../../../components/Select'
import { BlockNavigationComponent } from '../../../components/BlockNavigation'
const RegisterForm = (props) => {
  const { dirty, isSubmitting, handleSubmit } = props
  return (
    <form onSubmit={handleSubmit}>
      <BlockNavigationComponent open={dirty && !isSubmitting} />
      <Field
        type='text'
        name='email'
        label='Email'
        component={Input}
      />
      <Field
        type='text'
        name='fullName'
        label='Full Name'
        component={Input}
      />
      <Field
        type='text'
        name='address'
        label='Address'
        component={Textarea}
      />
      <Field
        name='gender'
        label='Gender'
        component={Select}
        options={[
          { text: 'Male', value: '0' },
          { text: 'Female', value: '1' }
        ]}
      />
      <button
        type='submit'
        className='btn btn-default'
        disabled={isSubmitting || !dirty}
      >
      Submit
      </button>
    </form>
  )
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required('This field is mandatory'),
  fullName: Yup.string().required('This field is mandatory'),
  address: Yup.string().required('This field is mandatory'),
  gender: Yup.string().required('This field is mandatory')
})

export default class Register extends Component {
  render () {
    const initialValues = {
      email: '',
      fullName: '',
      address: '',
      gender: ''
    }
    return (
      <FormModel
        schema={validationSchema}
        initialValues={initialValues}
        submitHandler={this.submitHandler}
        component={<RegisterForm />}
      />
    )
  }
  submitHandler = (values) => {
    console.log(JSON.stringify(values))
  }
}
