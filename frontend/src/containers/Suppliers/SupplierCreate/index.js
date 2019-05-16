import React from 'react'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'
import SnackBar from '../../../components/Snackbar/index'

// import Users from './Users'
// import Profile from './Profile'
// import Production from './Production'
// import Multitabs from '../../../components/Multitabs'
import QueueAnim from 'rc-queue-anim'
import FormModel from '../../../components/FormModel'
import FormSupplierCreate from './components/FormSupplierCreate'
import { MUTATION_CREATE_SUPPLIER } from './supplierCreate.typedef'
import { QUERY_SUPPLIERS } from '../supplier.typedef'
import { supplierCreateValidationSchema } from '../supplier.validattions'
import { initialCreateSupplierValues } from '../supplier.initialOriginalValues'

class SupplierCreate extends React.Component {
  render () {
    const { openCreateSupplierMode, alertMessage } = this.props
    const supplierCreateValidation = supplierCreateValidationSchema(openCreateSupplierMode)
    return (
      <div style={{ padding: 24 }}>
        <QueueAnim type='bottom' className='ui-animate'>
          <div key='1'>
            <article className='article master'>
              <h2 className='article-title page-title'>Supplier New</h2>
              <FormModel
                schema={supplierCreateValidation}
                initialValues={initialCreateSupplierValues}
                submitHandler={this.handleSubmit}
                component={<FormSupplierCreate openCreateSupplierMode={openCreateSupplierMode} />}
              />
              <hr />
            </article>
          </div>
        </QueueAnim>
        {openCreateSupplierMode && <SnackBar message={alertMessage.message} variant={alertMessage.variant} />}
      </div>
    )
  }
  handleSubmit = async (values, { setSubmitting, setErrors, setTouched }) => {
    const { createSupplier, handleToggleMode, openCreateSupplierMode, history, handleShowMessage } = this.props
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
          uptradeAccount: 'SUPPLIER',
          registration: 'FROM_CREATE_SUPPLIER'
        }
      }
      const supplier = {
        businessCard,
        contactPhone
      }
      let response = null
      if (openCreateSupplierMode) {
        response = await createSupplier({
          variables: {
            companyUptradeID: values.uptradeID,
            user,
            company,
            supplier
          },
          refetchQueries: [{
            query: QUERY_SUPPLIERS,
            variables: {
              page: 1,
              limit: 10
            }
          }]
        })
      } else {
        response = await createSupplier({
          variables: {
            companyUptradeID: values.uptradeID
          },
          refetchQueries: [{
            query: QUERY_SUPPLIERS,
            variables: {
              page: 1,
              limit: 10
            }
          }]
        })
      }
      if (response && response.data && response.data.createSupplier) {
        const _id = response.data.createSupplier._id
        history.push(`/suppliers/profile/${_id}`)
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
    MUTATION_CREATE_SUPPLIER,
    {
      name: 'createSupplier'
    }
  ),
  withStateHandlers(({
    openCreateSupplierMode = false,
    alertMessage = {
      message: '',
      variant: ''
    }
  }) => ({
    openCreateSupplierMode,
    alertMessage
  }), {
    handleToggleMode: () => () => {
      return { openCreateSupplierMode: true }
    },
    handleShowMessage: () => (message, type) => {
      return {
        alertMessage: { message: message, variant: type }
      }
    }
  })
)(SupplierCreate)
