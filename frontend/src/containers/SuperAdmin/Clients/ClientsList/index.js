import React, { Component } from 'react'
import QueueAnim from 'rc-queue-anim'
import { graphql } from 'react-apollo'

import { QUERY_COMPANIES } from '../client.typedef'
import ClientTable from '../../../../components/List'
import { ComponentLoading } from '../../../../components/Loading'
import Helper from '../../../../Helper'

// Fields to show in the table, and what object properties in the data they bind to
const fields = [
  {
    name: 'name',
    displayName: 'Company',
    inputFilterable: true,
    sortable: true
  },
  {
    name: 'uptradeID',
    displayName: 'Uptrade ID',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'registration',
    displayName: 'Registration Type',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'activeUser',
    displayName: 'Active User',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'status',
    displayName: 'Status',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'createdAt',
    displayName: 'Creation Date',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  }
]
class ClientsList extends Component {
  componentWillMount () {
    const { getClients } = this.props
    const { refetch } = getClients
    refetch()
  }
  render () {
    const { history, getClients } = this.props
    if (getClients.loading) {
      return <ComponentLoading />
    } else {
      const { companies, totalCompanies } = getClients.companies
      let data = []
      companies.forEach(companie => {
        const { fullName, uptradeID, registration, status, activeUser } = companie.about
        let { createdAt } = companie
        if (createdAt) {
          createdAt = Helper.getFormattedDate(createdAt)
        }
        data.push({
          _id: companie._id,
          name: {
            type: 'string',
            val: fullName
          },
          uptradeID: {
            type: 'string',
            val: uptradeID
          },
          registration: {
            type: 'string',
            val: registration
          },
          activeUser: {
            type: 'string',
            val: activeUser || ''
          },
          status: {
            type: 'string',
            val: status
          },
          createdAt: {
            type: 'date',
            val: createdAt || ''
          }
        })
      })

      return (
        <div className='container-fluid container-mw-xl chapter'>
          <QueueAnim type='bottom' className='ui-animate'>
            <div key='1'>
              <article className='article master'>
                <h2 className='article-title page-title'>Clients</h2>
                {
                  companies && <ClientTable
                    history={history}
                    fields={fields}
                    data={data}
                    total={totalCompanies}
                    handleChangePage={this.handleChangePage}
                    addNewHandler={this.addNewClientHandler}
                    clickRowHandler={this.clickRowHandler}
                  />
                }
              </article>
            </div>
          </QueueAnim>
        </div>
      )
    }
  }

  addNewClientHandler = () => {
    this.props.history.push('/clients/new')
  }
  clickRowHandler = (idItem) => {
    this.props.history.push(`/clients/detail/${idItem}`)
  }
  handleChangePage = (page, limit = 10) => {
    const { getClients } = this.props
    getClients.fetchMore({
      variables: {
        page,
        limit
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        return {
          ...previousResult,
          companies: fetchMoreResult.companies
        }
      }
    })
  }
}
export default graphql(QUERY_COMPANIES, {
  name: 'getClients',
  options: props => {
    return {
      variables: {
        page: 1,
        limit: 10
      }
    }
  }
})(ClientsList)
