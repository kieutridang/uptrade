import React from 'react'

import QueueAnim from 'rc-queue-anim'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'

import FormModel from '../../../../components/FormModel'
import { ComponentLoading } from '../../../../components/Loading'
import Factory from './components/Factory'
import AddSearchUpDown from '../../../../components/SearchBars/AddSearchUpDown'

import { QUERY_COMPANY, MUTATION_UPDATE_COMPANY } from '../../settings.typedef'

class Productions extends React.Component {
  render () {
    const { getCompany, handleToggleActiveEdit, cardActiveEdit, cardActiveIndex, submitUpdateProduction } = this.props
    if (getCompany.loading) {
      return <ComponentLoading />
    } else {
      const companyDetail = getCompany.company
      return (
        companyDetail &&
        <QueueAnim type='bottom' className='ui-animate'>
          <article className='article products closebox'>
            <div className='row'>
              <div className='col-sm-12'>
                <AddSearchUpDown />
                <FormModel
                  initialValues={companyDetail}
                  submitHandler={submitUpdateProduction}
                  component={<Factory
                    cardActiveEdit={cardActiveEdit}
                    cardActiveIndex={cardActiveIndex}
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
      cardActiveEdit = null,
      cardActiveIndex = null
    }) => ({
      cardActiveEdit
    }), {
      handleToggleActiveEdit: (_, props) => (type, index, name = null) => {
        let result
        if (type === 'edit') {
          result = name
        } else {
          result = false
        }
        return {
          cardActiveEdit: result,
          cardActiveIndex: index
        }
      }
    }
  ),
  withStateHandlers(
    (_) => ({}), {
      submitUpdateProduction: (_, props) => async (values) => {
        const { updateCompany, handleToggleActiveEdit, cardActiveIndex } = props
        const productions = values.productions
        productions.forEach(item => {
          delete item.__typename
        })
        const company = {
          productions: productions
        }
        const response = await updateCompany({
          variables: {
            id: values._id,
            company
          },
          refetchQueries: [{
            query: QUERY_COMPANY,
            variables: {
              companyUptradeID: window.localStorage.getItem('companyUptradeID')
            }
          }]
        })
        if (response && response.data && response.data.updateCompany) {
          handleToggleActiveEdit('show', cardActiveIndex)
        }
      }
    }
  )
)(Productions)
