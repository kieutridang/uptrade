import React, { Component } from 'react'
import { Formik } from 'formik'

export default class FormModel extends Component {
  render () {
    const {
      schema,
      initialValues,
      submitHandler,
      component
    } = this.props
    return (
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={submitHandler}
        render={props => {
          return React.cloneElement(component, props)
        }}
      />
    )
  }
}
