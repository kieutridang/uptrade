import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

const MUTATION_INIT_DEMO = gql`
  mutation {
    initDummy
  }
`

const InitDemo = props => {
  const { initDummy } = props
  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
      <button onClick={() => {
        initDummy().then(() => {
          window.alert('Init demo success')
        })
      }}>
        Init demo
      </button>
    </div>
  )
}

export default compose(
  graphql(MUTATION_INIT_DEMO, { name: 'initDummy' })
)(InitDemo)
