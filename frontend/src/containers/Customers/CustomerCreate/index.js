import React from 'react'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'
import SnackBar from '../../../components/Snackbar/index'

import QueueAnim from 'rc-queue-anim'
import FormModel from '../../../components/FormModel'
import FormCustomerCreate from './components/FormCustomerCreate'
import { MUTATION_CREATE_CUSTOMER, QUERY_CUSTOMERS } from '../customers.typedef'
import { customerCreateValidationSchema } from '../customer.validattions'
import { initialCreateCustomerValues } from '../customer.initialOriginalValues'

class CustomerCreate extends React.Component {
  render () {
    const { openCreateCustomerMode, alertMessage } = this.props
    const customerCreateValidation = customerCreateValidationSchema(openCreateCustomerMode)
    return (
      <div style={{ padding: 24 }}>
        <QueueAnim type='bottom' className='ui-animate'>
          <div key='1'>
            <article className='article master'>
              <h2 className='article-title page-title'>Customer New</h2>
              <FormModel
                schema={customerCreateValidation}
                initialValues={initialCreateCustomerValues}
                submitHandler={this.handleSubmit}
                component={<FormCustomerCreate openCreateCustomerMode={openCreateCustomerMode} />}
              />
              <hr />
            </article>
          </div>
        </QueueAnim>
        {openCreateCustomerMode && <SnackBar message={alertMessage.message} variant={alertMessage.variant} />}
      </div>
    )
  }
  handleSubmit = async (values, { setSubmitting, setErrors, setTouched }) => {
    const { createCustomer, handleToggleMode, openCreateCustomerMode, history, handleShowMessage } = this.props
    setSubmitting(true)
    try {
      const { firstName, lastName, email, uptradeID, name, fullName, contactPhone, businessCard } = values
      const user = {
        lastName,
        firstName,
        email,
        companyUptradeID: uptradeID
      }
      const company = {
        about: {
          uptradeID,
          name,
          status: 'INACTIVE',
          fullName,
          uptradeAccount: 'BUYER',
          registration: 'FROM_CREATE_CUSTOMER'
        }
      }
      const customer = {
        businessCard,
        contactPhone
      }
      let response = null
      if (openCreateCustomerMode) {
        response = await createCustomer({
          variables: {
            customer,
            user,
            company
          },
          refetchQueries: [{
            query: QUERY_CUSTOMERS,
            variables: {
              page: 1,
              limit: 10
            }
          }]
        })
      } else {
        response = await createCustomer({
          variables: {
            company
          },
          refetchQueries: [{
            query: QUERY_CUSTOMERS,
            variables: {
              page: 1,
              limit: 10
            }
          }]
        })
      }
      if (response && response.data && response.data.createCustomer) {
        const customerId = response.data.createCustomer._id
        history.push(`/customers/detail/${customerId}`)
      }
    } catch (exception) {
      const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message) : 'Unknown error occured'
      if (msg[0] === `Company don't exist in DB`) {
        handleShowMessage(msg[0], 'info')
        handleToggleMode()
        setTouched({})
      }
      setErrors({
        form: msg
      })
      console.error(msg, exception)
    }
    setSubmitting(false)
  }
}

export default compose(
  graphql(
    MUTATION_CREATE_CUSTOMER,
    {
      name: 'createCustomer'
    }
  ),
  withStateHandlers(({
    openCreateCustomerMode = false,
    alertMessage = {
      message: '',
      variant: ''
    }
  }) => ({
    openCreateCustomerMode,
    alertMessage
  }), {
    handleToggleMode: () => () => {
      return { openCreateCustomerMode: true }
    },
    handleShowMessage: () => (message, type) => {
      return {
        alertMessage: { message: message, variant: type }
      }
    }
  })
)(CustomerCreate)
