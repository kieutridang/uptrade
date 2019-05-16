import React from 'react'
import { graphql } from 'react-apollo'
import Userslist from './components/Userslist'

import { QUERY_CUSTOMER } from '../customers.typedef'
import { ComponentLoading } from '../../../components/Loading'

const Users = (props) => {
  const { getCustomer } = props
  if (getCustomer.loading) {
    return (<ComponentLoading />)
  } else {
    const customerDetail = getCustomer.customer
    let users
    if (customerDetail) {
      users = customerDetail._company._users
    }
    return (
      <article className='article products closebox'>
        <div className='row article-notitle'>
          <div className='col-sm-12'>
            <div className='box box-default'>
              <div className='box-header'>Users</div>
              <div className='box-divider' />
              <div className='box-body' style={{ paddingBottom: '20px' }}>
                <div className='container'>
                  <div className='row'>
                    <Userslist dataList={users} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }
}

export default graphql(QUERY_CUSTOMER, {
  name: 'getCustomer',
  options: props => {
    return {
      variables: {
        id: props.match.params.id
      }
    }
  }
})(Users)
