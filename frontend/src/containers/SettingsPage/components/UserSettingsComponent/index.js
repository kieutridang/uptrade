import React from 'react'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'
import { QUERY_USERSETTINGS_SETTING, MUTATION_UPDATE_USERSETTINGS_SETTING } from '../../setting.typedef'
import DepartmentsBox from './components/Departments'
import AccessRightsBox from './components/AccessRights'
import { ComponentLoading } from '../../../../components/Loading'
import SnackBar from '../../../../components/Snackbar/index'
import './index.scss'

class UserSettingsComponent extends React.Component {
  componentWillReceiveProps (nextProps) {
    const {
      viewDepartmentMode,
      handleInitDepartmentMode,
      getUserSettings,
      handleInitAccessRights
    } = nextProps
    if (getUserSettings.loading || !getUserSettings.company) {
      return
    }
    if (viewDepartmentMode.length < getUserSettings.company.userSettings.departments.length) {
      handleInitDepartmentMode(getUserSettings.company.userSettings.departments.length)
    }
    if (!getUserSettings.company.userSettings.accessRights) {
      handleInitAccessRights()
    }
  }
  render () {
    const {
      getUserSettings,
      viewAccessRightMode,
      viewDepartmentMode,
      handleToggleActiveEdit,
      handleIncreaseDepartmentMode,
      submitUpdateDepartmentHandler,
      submitUpdateAccessRightHandler,
      alertMessage
    } = this.props
    if (getUserSettings.loading) {
      return <ComponentLoading />
    }
    return (
      <article className='article products closebox'>
        <div className='row article-notitle'>
          <div className='col-sm-12'>
            <DepartmentsBox
              viewDepartmentMode={viewDepartmentMode}
              handleToggleActiveEdit={handleToggleActiveEdit}
              handleSubmit={submitUpdateDepartmentHandler}
              departments={getUserSettings.company.userSettings.departments}
              handleIncreaseDepartmentMode={handleIncreaseDepartmentMode}
            />
            <AccessRightsBox
              viewAccessRightMode={viewAccessRightMode}
              handleToggleActiveEdit={handleToggleActiveEdit}
              handleSubmit={submitUpdateAccessRightHandler}
              accessRights={getUserSettings.company.userSettings.accessRights}
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

export default compose(
  graphql(QUERY_USERSETTINGS_SETTING, {
    name: 'getUserSettings',
    options: props => {
      return {
        variables: {
          companyUptradeID: window.localStorage.getItem('companyUptradeID')
        }
      }
    }
  }),
  graphql(MUTATION_UPDATE_USERSETTINGS_SETTING, {
    name: 'updateUserSettings'
  }),
  withStateHandlers(
    ({
      viewDepartmentMode = [],
      viewAccessRightMode = 'show',
      alertMessage = { message: '', variant: '' }
    }) => ({
      viewDepartmentMode,
      viewAccessRightMode,
      alertMessage
    }), {
      handleToggleActiveEdit: ({ viewDepartmentMode }) => (name, mode, index) => {
        switch (name) {
          case 'toggleDepartmentMode': {
            viewDepartmentMode[index] = mode
            return { viewDepartmentMode: viewDepartmentMode }
          }
          case 'toggleAccessRightMode': {
            return { viewAccessRightMode: mode }
          }
          default:
        }
      },
      handleAlertMessage: () => alert => {
        return { alertMessage: alert }
      },
      handleIncreaseDepartmentMode: ({ viewDepartmentMode }) => () => {
        return { viewDepartmentMode: [...viewDepartmentMode, 'show'] }
      },
      handleDeleteDepartmentMode: ({ viewDepartmentMode }) => (index) => {
        var newViewDepartmentMode = [...viewDepartmentMode]
        newViewDepartmentMode.splice(index, 1)
        return { viewDepartmentMode: newViewDepartmentMode }
      },
      handleInitDepartmentMode: ({ viewDepartmentMode }) => (length) => {
        var newDepartmentMode = viewDepartmentMode
        while (newDepartmentMode.length < length) {
          newDepartmentMode.push('show')
        }
        return { viewDepartmentMode: newDepartmentMode }
      }
    }
  ),
  withStateHandlers(_ => ({}), {
    refetchGetUserSettings: (_, { getUserSettings }) => () => {
      const { refetch } = getUserSettings
      refetch()
    }
  }),
  withStateHandlers(() => ({}), {
    handleInitAccessRights: (
      _,
      {
        getUserSettings,
        refetchGetUserSettings,
        updateUserSettings,
        handleAlertMessage
      }
    ) => async () => {
      try {
        let company = getUserSettings.company
        delete company._id
        delete company.__typename
        delete company.userSettings.__typename
        var newAccessRights = []
        const accountTypeList = ['ADMIN', 'DIRECTOR', 'MANAGER', 'EXECUTIVE', 'INTERN']
        const actionList = ['offers', 'products', 'saleStats']
        const optionList = ['view', 'edit', 'delete', 'download', 'upload']
        newAccessRights = accountTypeList.map(account => {
          var newAccessAccount = {}
          newAccessAccount.accountType = account
          actionList.forEach(action => {
            newAccessAccount[`${action}`] = {}
            optionList.forEach(option => {
              newAccessAccount[`${action}`][`${option}`] = false
            })
          })
          return newAccessAccount
        })
        company.userSettings.accessRights = newAccessRights
        const response = await updateUserSettings({
          variables: {
            companyUptradeID: window.localStorage.getItem('companyUptradeID'),
            company
          }
        })
        if (response && response.data && response.data.updateCompany) {
          refetchGetUserSettings()
        }
      } catch (exception) {
        const msg = exception.graphQLErrors
          ? exception.graphQLErrors.map(err => err.message).join(',')
          : 'Unknown error occured'
        if (msg) handleAlertMessage({ message: msg, variant: 'error' })
      }
    }
  }),
  withStateHandlers(_ => ({}), {
    submitUpdateDepartmentHandler: (
      _,
      {
        getUserSettings,
        refetchGetUserSettings,
        updateUserSettings,
        handleToggleActiveEdit,
        handleAlertMessage,
        handleDeleteDepartmentMode
      }
    ) => async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true)
      try {
        let company = getUserSettings.company
        let index = values.saveIndex
        let deleteIndex = values.deleteIndex
        delete company._id
        delete company.__typename
        delete company.userSettings.__typename
        if (company.userSettings.accessRights) {
          company.userSettings.accessRights.forEach(oneRole => {
            delete oneRole.__typename
            delete oneRole.offers.__typename
            delete oneRole.products.__typename
            delete oneRole.saleStats.__typename
          })
        }
        if (index > 0) {
          while (company.userSettings.departments.length <= index) {
            company.userSettings.departments.push('')
          }
          company.userSettings.departments[index] = values.departments[index]
        }
        if (deleteIndex > 0) {
          company.userSettings.departments.splice(deleteIndex, 1)
        }
        const response = await updateUserSettings({
          variables: {
            companyUptradeID: window.localStorage.getItem('companyUptradeID'),
            company
          }
        })
        if (response && response.data && response.data.updateCompany) {
          if (index > 0) {
            handleToggleActiveEdit('toggleDepartmentMode', 'show', index)
          }
          if (deleteIndex > 0) {
            handleDeleteDepartmentMode(deleteIndex)
          }
          refetchGetUserSettings()
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
      setSubmitting(false)
    }
  }),
  withStateHandlers(_ => ({}), {
    submitUpdateAccessRightHandler: (
      _,
      {
        getUserSettings,
        refetchGetUserSettings,
        updateUserSettings,
        handleToggleActiveEdit,
        handleAlertMessage
      }
    ) => async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true)
      try {
        let company = getUserSettings.company
        delete company._id
        delete company.__typename
        delete company.userSettings.__typename
        if (values.accessRights) {
          values.accessRights.forEach(oneRole => {
            delete oneRole.__typename
            delete oneRole.offers.__typename
            delete oneRole.products.__typename
            delete oneRole.saleStats.__typename
          })
        }
        company.userSettings.accessRights = values.accessRights
        const response = await updateUserSettings({
          variables: {
            companyUptradeID: window.localStorage.getItem('companyUptradeID'),
            company
          }
        })
        if (response && response.data && response.data.updateCompany) {
          handleToggleActiveEdit('toggleAccessRightMode', 'show')
          refetchGetUserSettings()
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
      setSubmitting(false)
    }
  })
)(UserSettingsComponent)
