import React from 'react'

import QueueAnim from 'rc-queue-anim'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'

import FormModel from '../../../../components/FormModel'
import { ComponentLoading } from '../../../../components/Loading'
import Management from './components/Management'
import About from './components/About'
import Address from './components/Address'
import Banking from './components/Banking'
import Incoterms from './components/Incoterms'
import Advanced from './components/Advanced'

import { QUERY_SUPPLIER, MUTATION_UPDATE_SUPPLIER } from '../../supplier.typedef'

class Profile extends React.Component {
  render () {
    const {
      getSupplier,
      handleToggleActiveEdit,
      viewManagementMode,
      viewAboutMode,
      viewAddressMode,
      viewBankingMode,
      viewIncotermsMode,
      viewAdvancedMode,
      submitUpdateManagementHandler,
      submitUpdateAboutHandler,
      submitUpdateAddressHandler,
      submitUpdateBankingHandler,
      submitUpdateIncotermsHandler,
      submitUpdateAdvancedHandler
    } = this.props
    if (getSupplier.loading) {
      return <ComponentLoading />
    } else {
      const supplierDetail = getSupplier.supplier
      return (
        supplierDetail &&
        <QueueAnim type='bottom' className='ui-animate'>
          <article className='article products closebox'>
            <div className='row article-notitle'>
              <div className='col-sm-12'>
                <FormModel
                  initialValues={supplierDetail}
                  submitHandler={submitUpdateManagementHandler}
                  component={<Management
                    viewMode={viewManagementMode}
                    handleToggleActiveEdit={handleToggleActiveEdit}
                    {...this.props}
                  />}
                />
                <FormModel
                  initialValues={supplierDetail._company.about}
                  submitHandler={submitUpdateAboutHandler}
                  component={<About
                    viewMode={viewAboutMode}
                    handleToggleActiveEdit={handleToggleActiveEdit}
                    {...this.props}
                  />}
                />
                <FormModel
                  initialValues={supplierDetail._company.address}
                  submitHandler={submitUpdateAddressHandler}
                  component={<Address
                    viewMode={viewAddressMode}
                    handleToggleActiveEdit={handleToggleActiveEdit}
                    {...this.props}
                  />}
                />
                <FormModel
                  initialValues={supplierDetail._company.banking}
                  submitHandler={submitUpdateBankingHandler}
                  component={<Banking
                    viewMode={viewBankingMode}
                    handleToggleActiveEdit={handleToggleActiveEdit}
                    {...this.props}
                  />}
                />
                <FormModel
                  initialValues={supplierDetail._company}
                  submitHandler={submitUpdateIncotermsHandler}
                  component={<Incoterms
                    viewMode={viewIncotermsMode}
                    handleToggleActiveEdit={handleToggleActiveEdit}
                    {...this.props}
                  />}
                />
                <FormModel
                  initialValues={supplierDetail._company.advanced}
                  submitHandler={submitUpdateAdvancedHandler}
                  component={<Advanced
                    viewMode={viewAdvancedMode}
                    handleToggleActiveEdit={handleToggleActiveEdit}
                    {...this.props}
                  />}
                />
              </div>
            </div>
          </article>
        </QueueAnim>
      )
    }
  }
}

export default compose(
  graphql(QUERY_SUPPLIER, {
    name: 'getSupplier',
    options: props => {
      return {
        variables: {
          id: props.match.params.id
        }
      }
    }
  }),
  graphql(MUTATION_UPDATE_SUPPLIER, {
    name: 'updateSupplier'
  }),
  withStateHandlers(
    ({
      viewManagementMode = 'show',
      viewAboutMode = 'show',
      viewAddressMode = 'show',
      viewBankingMode = 'show',
      viewIncotermsMode = 'show',
      viewAdvancedMode = 'show'
    }) => ({
      viewManagementMode,
      viewAboutMode,
      viewAddressMode,
      viewBankingMode,
      viewIncotermsMode,
      viewAdvancedMode
    }), {
      handleToggleActiveEdit: () => (name) => {
        switch (name) {
          case 'activeManagementEdit': {
            return { viewManagementMode: 'edit' }
          }
          case 'activeManagementShow': {
            return { viewManagementMode: 'show' }
          }
          case 'activeAboutEdit': {
            return { viewAboutMode: 'edit' }
          }
          case 'activeAboutShow': {
            return { viewAboutMode: 'show' }
          }
          case 'activeAddressEdit': {
            return { viewAddressMode: 'edit' }
          }
          case 'activeAddressShow': {
            return { viewAddressMode: 'show' }
          }
          case 'activeBankingEdit': {
            return { viewBankingMode: 'edit' }
          }
          case 'activeBankingShow': {
            return { viewBankingMode: 'show' }
          }
          case 'activeIncotermsEdit': {
            return { viewIncotermsMode: 'edit' }
          }
          case 'activeIncotermsShow': {
            return { viewIncotermsMode: 'show' }
          }
          case 'activeAdvancedEdit': {
            return { viewAdvancedMode: 'edit' }
          }
          case 'activeAdvancedShow': {
            return { viewAdvancedMode: 'show' }
          }
          default: return {}
        }
      }
    }
  ),
  withStateHandlers(
    (_) => ({}), {
      submitUpdateManagementHandler: (_, props) => (values, { setSubmitting, setErrors }) => {
        const { updateSupplier, match, handleToggleActiveEdit } = props
        setSubmitting(true)
        delete values.__typename
        delete values._id
        const supplier = {
          type: values.type,
          name: values.overwriteSupplierName,
          shareMyProfileDetails: values.shareMyProfileDetails,
          shareMyUsersDetails: values.shareMyUsersDetails
        }
        updateSupplier({
          variables: {
            id: match.params.id,
            supplier
          }
        }).then(response => {
          if (response && response.data && response.data.updateSupplier) {
            handleToggleActiveEdit('activeManagementShow')
          }
        }).catch(exception => {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        })
        setSubmitting(false)
      },
      submitUpdateAboutHandler: (_, props) => (values, { setSubmitting, setErrors }) => {
        const { updateSupplier, match, handleToggleActiveEdit } = props
        setSubmitting(true)

        delete values.__typename
        const supplier = {
          values
        }
        updateSupplier({
          variables: {
            id: match.params.id,
            supplier
          }
        }).then(response => {
          if (response && response.data && response.data.updateSupplier) {
            handleToggleActiveEdit('activeAboutShow')
          }
        }).catch(exception => {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
          console.error(msg, exception)
        })
        setSubmitting(false)
      },
      submitUpdateAddressHandler: (_, props) => (values, { setSubmitting, setErrors }) => {
        const { updateSupplier, match, handleToggleActiveEdit } = props
        setSubmitting(true)

        delete values.__typename
        const supplier = {
          values
        }
        updateSupplier({
          variables: {
            id: match.params.id,
            supplier
          }
        }).then(response => {
          if (response && response.data && response.data.updateSupplier) {
            handleToggleActiveEdit('activeAddressShow')
          }
        }).catch(exception => {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
          console.error(msg, exception)
        })
        setSubmitting(false)
      },
      submitUpdateBankingHandler: (_, props) => (values, { setSubmitting, setErrors }) => {
        const { updateSupplier, match, handleToggleActiveEdit } = props
        setSubmitting(true)

        delete values.__typename
        const supplier = {
          values
        }
        updateSupplier({
          variables: {
            id: match.params.id,
            supplier
          }
        }).then(response => {
          if (response && response.data && response.data.updateSupplier) {
            handleToggleActiveEdit('activeAddressShow')
          }
        }).catch(exception => {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
          console.error(msg, exception)
        })
        setSubmitting(false)
      },
      submitUpdateIncotermsHandler: (_, props) => (values, { setSubmitting, setErrors }) => {
        const { updateSupplier, match, handleToggleActiveEdit } = props
        setSubmitting(true)

        delete values.__typename
        const supplier = {
          values
        }
        updateSupplier({
          variables: {
            id: match.params.id,
            supplier
          }
        }).then(response => {
          if (response && response.data && response.data.updateSupplier) {
            handleToggleActiveEdit('activeAddressShow')
          }
        }).catch(exception => {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
          console.error(msg, exception)
        })
        setSubmitting(false)
      },
      submitUpdateAdvancedHandler: (_, props) => (values, { setSubmitting, setErrors }) => {
        const { updateSupplier, match, handleToggleActiveEdit } = props
        setSubmitting(true)

        delete values.__typename
        const supplier = {
          values
        }
        updateSupplier({
          variables: {
            id: match.params.id,
            supplier
          }
        }).then(response => {
          if (response && response.data && response.data.updateSupplier) {
            handleToggleActiveEdit('activeAddressShow')
          }
        }).catch(exception => {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
          console.error(msg, exception)
        })
        setSubmitting(false)
      }
    }
  )
)(Profile)
