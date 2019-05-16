import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'

import { QUERY_SUPPLIERS } from './supplier.typedef'
import { ComponentLoading } from '../../components/Loading'
import SupplierTable from '../../components/List'

const fields = [
  {
    name: 'uptradeID',
    displayName: 'UpTrade ID',
    inputFilterable: true,
    sortable: true
  },
  {
    name: 'name',
    displayName: 'Name',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'logo',
    displayName: 'Picture',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'categories',
    displayName: 'Categories',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'usersLimit',
    displayName: 'Users',
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
  }
]

class Supplier extends React.Component {
  render () {
    const {
      getSuppliers,
      history
    } = this.props
    if (getSuppliers.loading) {
      return <ComponentLoading />
    } else {
      let data = []
      let totalSuppliers = 0
      if (getSuppliers.companySuppliers) {
        const { suppliers } = getSuppliers.companySuppliers
        totalSuppliers = getSuppliers.companySuppliers.totalSuppliers
        suppliers.forEach(supplier => {
          const { _company } = supplier
          const { uptradeID, name, logo, status } = _company.about
          // let categoriesText = categories.join(', ')
          data.push({
            _id: supplier._id,
            uptradeID: {
              type: 'string',
              val: uptradeID
            },
            name: {
              type: 'string',
              val: name
            },
            logo: {
              type: 'image',
              val: logo
            },
            categories: {
              type: 'string',
              val: ''
            },
            usersLimit: {
              type: 'string',
              val: (supplier && supplier._company && supplier._company._users && supplier._company._users.length) || 0
            },
            status: {
              type: 'string',
              val: status
            }
          })
        })
      }
      return (
        <div style={{ padding: 24 }}>
          <QueueAnim type='bottom' className='ui-animate'>
            <div key='1'>
              <article className='article master'>
                <h2 className='article-title page-title'>Suppliers</h2>
                {
                  data && <SupplierTable
                    history={history}
                    fields={fields}
                    data={data}
                    total={totalSuppliers}
                    handleChangePage={this.handleChangePage}
                    addNewHandler={this.addNewSupplierHandler}
                    clickRowHandler={this.clickRowHandler}
                  />
                }
                <hr />
              </article>
            </div>
          </QueueAnim>
        </div>
      )
    }
  }
  handleChangePage = (page, limit = 10) => {
    const { getSuppliers } = this.props
    getSuppliers.fetchMore({
      variables: {
        page,
        limit
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        return {
          ...previousResult,
          companySuppliers: fetchMoreResult.companySuppliers
        }
      }
    })
  }
  clickRowHandler = (idItem) => {
    this.props.history.push(`/suppliers/profile/${idItem}`)
  }
  addNewSupplierHandler = () => {
    this.props.history.push('/suppliers/new')
  }
}

Supplier.propTypes = {
  getSuppliers: PropTypes.object
}

export default compose(
  graphql(
    QUERY_SUPPLIERS,
    {
      name: 'getSuppliers',
      options: props => {
        return {
          variables: {
            page: 1,
            limit: 10
          }
        }
      }
    }
  )
)(Supplier)
