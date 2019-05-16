import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'

import { QUERY_CUSTOMERS } from './customers.typedef'
import CustomerList from './CustomerList'

class Customer extends React.Component {
  render () {
    const {
      getCustomers
    } = this.props
    const customers = getCustomers.customers ? getCustomers.customers.customers : []
    const totalCustomers = getCustomers.customers ? getCustomers.customers.totalCustomers : 0
    return (
      <div className='container-fluid container-mw-xl chapter'>
        <QueueAnim type='bottom' className='ui-animate'>
          <div key='1'>
            <article className='article master'>
              {/* <h2 className='article-title page-title'>Customers</h2> */}
              {/* <AddSearchUpDown addHandler={this.addNewCustomerHandler} /> */}
              <CustomerList
                data={customers}
                handleChangePage={this.handleChangePage}
                clickRowHandler={this.clickRowHandler}
                addHandler={this.addNewCustomerHandler}
                totalCustomers={totalCustomers}
              />
            </article>
          </div>
        </QueueAnim>
      </div>
    )
  }
  handleChangePage = (page, limit = 10) => {
    const { getCustomers } = this.props
    getCustomers.fetchMore({
      variables: {
        page: page + 1,
        limit
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        return {
          ...previousResult,
          customers: fetchMoreResult.customers
        }
      }
    })
  }
  clickRowHandler = (idItem) => {
    this.props.history.push(`/customers/detail/${idItem}`)
  }
  addNewCustomerHandler = () => {
    this.props.history.push('/customers/new')
  }
}

Customer.propTypes = {
  getCustomers: PropTypes.object
}

export default compose(
  graphql(
    QUERY_CUSTOMERS,
    {
      name: 'getCustomers',
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
)(Customer)
