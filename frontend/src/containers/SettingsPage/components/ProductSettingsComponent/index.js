import React from 'react'
import * as Yup from 'yup'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'

import FormModel from '../../../../components/FormModel'
import { ComponentLoading } from '../../../../components/Loading'
import { QUERY_COMPANY, MUTATION_UPDATE_COMPANY } from '../../settings.typedef'
import './index.scss'

import ProductCategory from './components/ProductCategory'
import APPCONFIG from '../../../../config/AppConfig'
// import RequiredField from './components/RequiredField'

const errorMessage = APPCONFIG.form.message.required
const schemaProductSettings = Yup.object().shape({
  productSettings: Yup.array()
    .of(
      Yup.object().shape({
        category: Yup.string().required(errorMessage),
        subCategory: Yup.array()
          .of(
            Yup.string().required(errorMessage)
          ),
        customFields: Yup.array()
          .of(
            Yup.string().required(errorMessage)
          )
      })
    )
})
class ProductSettings extends React.Component {
  render () {
    const {
      getCompany,
      viewProductSettingsMode,
      handleToggleActiveEdit,
      submitUpdateProductSettings
    } = this.props
    if (getCompany.loading) {
      return (<ComponentLoading />)
    } else {
      const company = getCompany.company
      return (
        <article>
          <FormModel
            initialValues={{
              productSettings: company.productSettings
            }}
            schema={schemaProductSettings}
            submitHandler={submitUpdateProductSettings}
            component={<ProductCategory
              viewMode={viewProductSettingsMode}
              handleToggleActiveEdit={handleToggleActiveEdit}
            />}
          />
          {/* <RequiredField className={classes.requiredField} /> */}
        </article>
      )
    }
  }
}

export default compose(
  graphql(QUERY_COMPANY, {
    name: 'getCompany',
    options: props => {
      return {
        variables: {
          companyUptradeID: window.localStorage.getItem('companyUptradeID')
        }
      }
    }
  }),
  graphql(MUTATION_UPDATE_COMPANY, {
    name: 'updateCompany'
  }),
  withStateHandlers(
    ({
      viewProductSettingsMode = 'show'
    }) => ({
      viewProductSettingsMode
    }), {
      handleToggleActiveEdit: () => (name) => {
        switch (name) {
          case 'activeProductSettingsEdit': {
            return { viewProductSettingsMode: 'edit' }
          }
          case 'activeProductSettingsShow': {
            return { viewProductSettingsMode: 'show' }
          }
          default: return {}
        }
      }
    }
  ),
  withStateHandlers(
    (_) => ({}), {
      submitUpdateProductSettings: (_, props) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          const { updateCompany, handleToggleActiveEdit } = props
          const productSettings = values.productSettings
          productSettings.forEach(item => {
            delete item.__typename
          })
          const company = {
            productSettings
          }
          delete productSettings.__typename
          await updateCompany({
            variables: {
              companyUptradeID: window.localStorage.getItem('companyUptradeID'),
              company
            },
            refetchQueries: [{
              query: QUERY_COMPANY,
              variables: {
                companyUptradeID: window.localStorage.getItem('companyUptradeID')
              }
            }]
          })
          handleToggleActiveEdit('activeProductSettingsShow')
        } catch (exception) {
          const msg = exception.graphQLErrors
            ? exception.graphQLErrors.map(err => err.message).join(',')
            : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      }
    }
  )
)(ProductSettings)
