import React from 'react'

import { compose, withStateHandlers } from 'recompose'
import { graphql } from 'react-apollo'

import AboutBox from './AboutBox'
import AddressBox from './AddressBox'
import BankingBox from './BankingBox'
import CurrenciesBox from './CurrenciesBox'
import AdditionalLocationsBox from './AdditionalLocationsBox'
import IncotermsBox from './IncotermsBox'
import SnackBar from '../../../../components/Snackbar/index'

import FormModel from '../../../../components/FormModel'
import { ComponentLoading } from '../../../../components/Loading'

import {
  MUTATION_UPDATE_COMPANY_SETTING,
  QUERY_COMPANY_SETTING
} from '../../setting.typedef'

import './index.scss'

class CompanyComponent extends React.Component {
  render () {
    const {
      getCompanySetting,
      viewAboutMode,
      viewAddressMode,
      viewBankingMode,
      viewCurrenciesMode,
      viewIncotermsMode,
      viewAdditionalLocationsMode,

      submitUpdateBankingHandler,
      submitUpdateAboutHandler,
      submitUpdateAddressHandler,
      submitUpdateCurrenciesHandler,
      submitUpdateIncotermsHandler,
      submitUpdateAdditionalLocationsHandler,

      handleToggleViewMode,

      alertMessage
    } = this.props
    if (getCompanySetting.loading) {
      return <ComponentLoading />
    } else {
      const companySetting = getCompanySetting.company
      return (
        <article className='article products closebox'>
          <div className='row article-notitle'>
            <div className='col-sm-12'>
              <FormModel
                initialValues={companySetting.about}
                submitHandler={submitUpdateAboutHandler}
                component={
                  <AboutBox
                    viewMode={viewAboutMode}
                    handleToggleViewMode={handleToggleViewMode}
                  />
                }
              />
              <FormModel
                initialValues={companySetting.address}
                submitHandler={submitUpdateAddressHandler}
                component={
                  <AddressBox
                    viewMode={viewAddressMode}
                    handleToggleViewMode={handleToggleViewMode}
                  />
                }
              />
              <FormModel
                initialValues={companySetting.banking}
                submitHandler={submitUpdateBankingHandler}
                component={
                  <BankingBox
                    viewMode={viewBankingMode}
                    handleToggleViewMode={handleToggleViewMode}
                  />
                }
              />
              <FormModel
                initialValues={companySetting}
                submitHandler={submitUpdateCurrenciesHandler}
                component={
                  <CurrenciesBox
                    viewMode={viewCurrenciesMode}
                    handleToggleViewMode={handleToggleViewMode}
                  />
                }
              />
              <FormModel
                initialValues={companySetting}
                submitHandler={submitUpdateIncotermsHandler}
                component={
                  <IncotermsBox
                    viewMode={viewIncotermsMode}
                    handleToggleViewMode={handleToggleViewMode}
                  />
                }
              />
              <FormModel
                initialValues={companySetting}
                submitHandler={submitUpdateAdditionalLocationsHandler}
                component={
                  <AdditionalLocationsBox
                    viewMode={viewAdditionalLocationsMode}
                    handleToggleViewMode={handleToggleViewMode}
                  />
                }
              />
            </div>
          </div>
          {alertMessage.message && (
            <SnackBar
              message={alertMessage.message}
              variant={alertMessage.variant}
            />
          )}
        </article>
      )
    }
  }
}

CompanyComponent.propTypes = {}

export default compose(
  graphql(QUERY_COMPANY_SETTING, {
    name: 'getCompanySetting',
    options: props => {
      return {
        variables: {
          companyUptradeID: window.localStorage.getItem('companyUptradeID')
        }
      }
    }
  }),
  graphql(MUTATION_UPDATE_COMPANY_SETTING, {
    name: 'updateCompanySetting'
  }),
  withStateHandlers(
    ({
      viewAboutMode = 'show',
      viewAddressMode = 'show',
      viewBankingMode = 'show',
      viewCurrenciesMode = 'show',
      viewIncotermsMode = 'show',
      viewAdditionalLocationsMode = 'show',
      alertMessage = { message: '', variant: '' }
    }) => ({
      viewAboutMode,
      viewAddressMode,
      viewBankingMode,
      viewCurrenciesMode,
      viewIncotermsMode,
      viewAdditionalLocationsMode,
      alertMessage
    }),
    {
      handleToggleViewMode: () => ({ name, mode }) => {
        switch (name) {
          case 'toggleAboutMode': {
            return { viewAboutMode: mode }
          }
          case 'toggleAddressMode': {
            return { viewAddressMode: mode }
          }
          case 'toggleBankingMode': {
            return { viewBankingMode: mode }
          }
          case 'toggleCurrenciesMode': {
            return { viewCurrenciesMode: mode }
          }
          case 'toggleIncotermsMode': {
            return { viewIncotermsMode: mode }
          }
          case 'toggleAdditionalLocationsMode': {
            return { viewAdditionalLocationsMode: mode }
          }
          default:
        }
      },
      handleAlertMessage: () => alert => {
        return { alertMessage: alert }
      }
    }
  ),
  withStateHandlers(_ => ({}), {
    refetchGetCompanySetting: (_, { getCompanySetting }) => () => {
      const { refetch } = getCompanySetting
      refetch()
    }
  }),
  withStateHandlers(_ => ({}), {
    submitUpdateBankingHandler: (
      _,
      {
        refetchGetCompanySetting,
        updateCompanySetting,
        handleToggleViewMode,
        handleAlertMessage
      }
    ) => async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true)
      try {
        delete values.__typename
        if (values.bankingInfos) { values.bankingInfos.forEach((value, index) => delete value.__typename) }
        let company = {
          banking: values
        }
        const response = await updateCompanySetting({
          variables: {
            companyUptradeID: window.localStorage.getItem('companyUptradeID'),
            company
          }
        })
        if (response && response.data && response.data.updateCompany) {
          refetchGetCompanySetting()
          handleToggleViewMode({ name: 'toggleBankingMode', mode: 'show' })
        }
      } catch (exception) {
        const msg = exception.graphQLErrors
          ? exception.graphQLErrors.map(err => err.message).join(',')
          : 'Unknown error occured'
        if (msg) handleAlertMessage({ message: msg, variant: 'error' })
        setErrors({
          form: msg
        })
      }
    },
    submitUpdateAboutHandler: (
      _,
      {
        refetchGetCompanySetting,
        updateCompanySetting,
        handleToggleViewMode,
        handleAlertMessage
      }
    ) => async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true)
      try {
        delete values.__typename
        let company = {
          about: values
        }
        const response = await updateCompanySetting({
          variables: {
            companyUptradeID: window.localStorage.getItem('companyUptradeID'),
            company
          }
        })
        if (response && response.data && response.data.updateCompany) {
          refetchGetCompanySetting()
          handleToggleViewMode({ name: 'toggleAboutMode', mode: 'show' })
        }
      } catch (exception) {
        const msg = exception.graphQLErrors
          ? exception.graphQLErrors.map(err => err.message).join(',')
          : 'Unknown error occured'
        if (msg) handleAlertMessage({ message: msg, variant: 'error' })
        setErrors({
          form: msg
        })
      }
    },
    submitUpdateAddressHandler: (
      _,
      {
        refetchGetCompanySetting,
        updateCompanySetting,
        handleToggleViewMode,
        handleAlertMessage
      }
    ) => async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true)
      try {
        delete values.__typename
        let company = {
          address: values
        }
        const response = await updateCompanySetting({
          variables: {
            companyUptradeID: window.localStorage.getItem('companyUptradeID'),
            company
          }
        })
        if (response && response.data && response.data.updateCompany) {
          refetchGetCompanySetting()
          handleToggleViewMode({ name: 'toggleAddressMode', mode: 'show' })
        }
      } catch (exception) {
        const msg = exception.graphQLErrors
          ? exception.graphQLErrors.map(err => err.message).join(',')
          : 'Unknown error occured'
        if (msg) handleAlertMessage({ message: msg, variant: 'error' })
        setErrors({
          form: msg
        })
      }
    },
    submitUpdateIncotermsHandler: (
      _,
      {
        refetchGetCompanySetting,
        updateCompanySetting,
        handleToggleViewMode,
        handleAlertMessage
      }
    ) => async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true)
      try {
        delete values.__typename
        let company = {
          incoterms: values.incoterms
        }
        const response = await updateCompanySetting({
          variables: {
            companyUptradeID: window.localStorage.getItem('companyUptradeID'),
            company
          }
        })
        if (response && response.data && response.data.updateCompany) {
          refetchGetCompanySetting()
          handleToggleViewMode({ name: 'toggleIncotermsMode', mode: 'show' })
        }
      } catch (exception) {
        const msg = exception.graphQLErrors
          ? exception.graphQLErrors.map(err => err.message).join(',')
          : 'Unknown error occured'
        if (msg) handleAlertMessage({ message: msg, variant: 'error' })
        setErrors({
          form: msg
        })
      }
    },
    submitUpdateAdditionalLocationsHandler: (
      _,
      {
        refetchGetCompanySetting,
        updateCompanySetting,
        handleToggleViewMode,
        handleAlertMessage
      }
    ) => async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true)
      try {
        delete values.__typename
        values.additionalLocations.forEach(item => delete item.__typename)
        let company = {
          additionalLocations: values.additionalLocations
        }
        const response = await updateCompanySetting({
          variables: {
            companyUptradeID: window.localStorage.getItem('companyUptradeID'),
            company
          }
        })
        if (response && response.data && response.data.updateCompany) {
          refetchGetCompanySetting()
          handleToggleViewMode({
            name: 'toggleAdditionalLocationsMode',
            mode: 'show'
          })
        }
      } catch (exception) {
        const msg = exception.graphQLErrors
          ? exception.graphQLErrors.map(err => err.message).join(',')
          : 'Unknown error occured'
        if (msg) handleAlertMessage({ message: msg, variant: 'error' })
        setErrors({
          form: msg
        })
      }
    },
    submitUpdateCurrenciesHandler: (
      _,
      {
        refetchGetCompanySetting,
        updateCompanySetting,
        handleToggleViewMode,
        handleAlertMessage
      }
    ) => async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true)
      try {
        delete values.__typename
        values.currencies.forEach(item => delete item.__typename)
        let company = {
          currencies: values.currencies
        }
        const response = await updateCompanySetting({
          variables: {
            companyUptradeID: window.localStorage.getItem('companyUptradeID'),
            company
          }
        })
        if (response && response.data && response.data.updateCompany) {
          refetchGetCompanySetting()
          handleToggleViewMode({ name: 'toggleCurrenciesMode', mode: 'show' })
        }
      } catch (exception) {
        const msg = exception.graphQLErrors
          ? exception.graphQLErrors.map(err => err.message).join(',')
          : 'Unknown error occured'
        if (msg) handleAlertMessage({ message: msg, variant: 'error' })
        setErrors({
          form: msg
        })
      }
    }
  })
)(CompanyComponent)
