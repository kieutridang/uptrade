import React from 'react'
import Typography from '@material-ui/core/Typography'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'

import Company from '../components/CreateCompany'
import '../index.scss'
import { MUTATION_CREATE_COMPANY } from '../client.typedef'
import { companyValidationSchema } from '../client.validation'
import { initialCompanyValues } from '../client.initialOriginalValues'

class ClientsCreate extends React.Component {
  render () {
    const { viewCompanyMode, submitCreateCompanyHandler } = this.props
    return (
      <Typography component='div' style={{ padding: 24 }}>
        <article className='article products closebox'>
          <div className='row article-notitle'>
            <div className='col-sm-12'>
              <Company
                viewMode={viewCompanyMode}
                validationSchema={companyValidationSchema}
                initialValues={initialCompanyValues}
                submitHandler={submitCreateCompanyHandler}
              />
            </div>
          </div>
        </article>
      </Typography>
    )
  }
}

export default compose(
  graphql(MUTATION_CREATE_COMPANY, {
    name: 'createCompany'
  }),
  withStateHandlers(
    ({
      viewCompanyMode = 'new'
    }) => ({
      viewCompanyMode
    }), {
      submitCreateCompanyHandler: (_, { createCompany, history }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          const response = await createCompany({
            variables: {
              company: { about: values }
            }
          })
          if (response && response.data && response.data.createCompany) {
            const id = response.data.createCompany._id
            history.push(`/clients/detail/${id}`)
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      },
      handleToggleActiveEdit: () => (name) => {
        switch (name) {
          case 'activeCompanyEdit': {
            return { viewCompanyMode: 'save' }
          }
          case 'activeProfileEdit': {
            return { viewProfileMode: 'save' }
          }
          default: return {}
        }
      }
    }
  )
)(ClientsCreate)
