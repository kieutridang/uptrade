import React from 'react'

import QueueAnim from 'rc-queue-anim'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import FormModel from '../../../../components/FormModel'
import { ComponentLoading } from '../../../../components/Loading'
import Factory from './components/Factory'

import { QUERY_SUPPLIER } from '../../supplier.typedef'

class Productions extends React.Component {
  render () {
    const { getSupplier } = this.props
    if (getSupplier.loading) {
      return <ComponentLoading />
    } else {
      const companyOfSupplier = getSupplier.supplier._company
      return (
        companyOfSupplier &&
        <QueueAnim type='bottom' className='ui-animate'>
          <article className='article products closebox'>
            <div className='row article-notitle'>
              <div className='col-sm-12'>
                <FormModel
                  initialValues={companyOfSupplier}
                  submitHandler={() => { return null }}
                  component={<Factory
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
  })
)(Productions)
