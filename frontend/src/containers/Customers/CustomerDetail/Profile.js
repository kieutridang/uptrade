import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'

import FormModel from '../../../components/FormModel'
import { ComponentLoading } from '../../../components/Loading'
import About from './components/About'
import Address from './components/Address'
import Management from './components/Management'
import Incoterms from './components/Incoterms'
import Advanced from './components/Advanced'
// import Standards from './components/Standards'

import { QUERY_CUSTOMER, MUTATION_UPDATE_CUSTOMER } from '../customers.typedef'

class Profile extends React.Component {
  render () {
    const {
      getCustomer,

      viewManagementMode,
      viewAboutMode,
      viewAddressMode,
      viewIncotermstMode,
      viewAdvanceMode,

      submitUpdateManagementHandler,
      submitUpdateAboutHandler,
      submitUpdateAddressHandler,
      submitUpdateIncotermsHandler,
      submitUpdateAdvanceHandler,

      handleToggleActiveEdit

    } = this.props
    if (getCustomer.loading) {
      return <ComponentLoading />
    } else {
      const customerDetail = getCustomer.customer
      return (
        customerDetail && <div>
          <QueueAnim>
            <article className='article products closebox'>
              <div className='row article-notitle'>
                <div className='col-sm-12'>
                  <FormModel
                    initialValues={customerDetail}
                    submitHandler={submitUpdateManagementHandler}
                    component={<Management
                      viewMode={viewManagementMode}
                      handleToggleActiveEdit={handleToggleActiveEdit}
                    />}
                  />
                  <FormModel
                    initialValues={customerDetail._company.about}
                    submitHandler={submitUpdateAboutHandler}
                    component={<About
                      viewMode={viewAboutMode}
                      handleToggleActiveEdit={handleToggleActiveEdit}
                    />}
                  />
                  <FormModel
                    initialValues={customerDetail._company.address}
                    submitHandler={submitUpdateAddressHandler}
                    component={<Address
                      viewMode={viewAddressMode}
                      handleToggleActiveEdit={handleToggleActiveEdit}
                    />}
                  />
                  <FormModel
                    initialValues={customerDetail._company}
                    submitHandler={submitUpdateIncotermsHandler}
                    component={<Incoterms
                      viewMode={viewIncotermstMode}
                      handleToggleActiveEdit={handleToggleActiveEdit}
                    />}
                  />
                  <FormModel
                    initialValues={customerDetail._company.advanced}
                    submitHandler={submitUpdateAdvanceHandler}
                    component={<Advanced
                      viewMode={viewAdvanceMode}
                      handleToggleActiveEdit={handleToggleActiveEdit}
                    />}
                  />
                  {/* <FormModel
                    initialValues={customerDetail._company.advanced}
                    submitHandler={submitUpdateAdvanceHandler}
                    component={<Standards
                      viewMode={viewAdvanceMode}
                      handleToggleActiveEdit={handleToggleActiveEdit}
                    />}
                  /> */}
                  <div className='box box-default'>
                    <div className='box-header'>Messages</div>
                    <div className='box-divider' />
                    <div className='box-body' />
                  </div>
                </div>
              </div>
            </article>

          </QueueAnim>
        </div>
      )
    }
  }
}

export default compose(
  graphql(QUERY_CUSTOMER, {
    name: 'getCustomer',
    options: props => {
      return {
        variables: {
          id: props.match.params.id
        }
      }
    }
  }),
  graphql(MUTATION_UPDATE_CUSTOMER, {
    name: 'updateCustomer'
  }),
  withStateHandlers(
    ({
      viewManagementMode = 'show',
      viewAboutMode = 'show',
      viewAddressMode = 'show',
      viewIncotermstMode = 'show',
      viewAdvanceMode = 'show'
    }) => ({
      viewManagementMode,
      viewAboutMode,
      viewAddressMode,
      viewIncotermstMode,
      viewAdvanceMode
    }), {
      handleToggleActiveEdit: () => (name) => {
        switch (name) {
          case 'activeManagementEdit': {
            return { viewManagementMode: 'edit' }
          }
          case 'activeAboutEdit': {
            return { viewAboutMode: 'edit' }
          }
          case 'activeAddressEdit': {
            return { viewAddressMode: 'edit' }
          }
          case 'activeIncotermsEdit': {
            return { viewIncotermsMode: 'edit' }
          }
          case 'activeAdvanceEdit': {
            return { viewAdvanceMode: 'edit' }
          }
          case 'activeManagementShow': {
            return { viewManagementMode: 'show' }
          }
          case 'activeAboutShow': {
            return { viewAboutMode: 'show' }
          }
          case 'activeAddressShow': {
            return { viewAddressMode: 'show' }
          }
          case 'activeIncotermsShow': {
            return { viewIncotermsMode: 'show' }
          }
          case 'activeAdvanceShow': {
            return { viewAdvanceMode: 'show' }
          }
          default: return {}
        }
      }
    }
  ),
  withStateHandlers(
    (_) => ({}), {
      submitUpdateManagementHandler: (_, { updateCustomer, match, handleToggleActiveEdit }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          const customer = {
            name: values.name,
            businessCard: values.businessCard,
            contactPhone: values.contactPhone,
            contactEmail: values.contactEmail,
            shareMyProfileDetails: values.shareMyProfileDetails,
            shareMyUsersDetails: values.shareMyUsersDetails,
            companyId: values.companyId
          }
          const response = await updateCustomer({
            variables: {
              id: match.params.id,
              customer
            }
          })
          if (response && response.data && response.data.updateCustomer) {
            handleToggleActiveEdit('activeManagementShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      },
      submitUpdateAboutHandler: (_, { updateCustomer, match, handleToggleActiveEdit }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          delete values.__typename
          const customer = {

          }
          const response = await updateCustomer({
            variables: {
              id: match.params.id,
              customer
            }
          })
          if (response && response.data && response.updateCustomer) {
            handleToggleActiveEdit('activeAboutShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      },
      submitUpdateAddressHandler: (_, { updateCustomer, match, handleToggleActiveEdit }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          delete values.__typename
          const customer = {

          }
          const response = await updateCustomer({
            variables: {
              id: match.params.id,
              customer
            }
          })
          if (response && response.data && response.updateCustomer) {
            handleToggleActiveEdit('activeAddressShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      },
      submitUpdateIncotermsHandler: (_, { updateCustomer, match, handleToggleActiveEdit }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          delete values.__typename
          const customer = {

          }
          const response = await updateCustomer({
            variables: {
              id: match.params.id,
              customer
            }
          })
          if (response && response.data && response.updateCustomer) {
            handleToggleActiveEdit('activeIncotermsShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      },
      submitUpdateAdvanceHandler: (_, { updateCustomer, match, handleToggleActiveEdit }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          delete values.__typename
          const customer = {

          }
          const response = await updateCustomer({
            variables: {
              id: match.params.id,
              customer
            }
          })
          if (response && response.data && response.updateCustomer) {
            handleToggleActiveEdit('activeAdvanceShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      }
    }
  )
)(Profile)
