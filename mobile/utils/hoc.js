import React from 'react'
import { NetworkConsumer } from 'react-native-offline'

export const withNetworkCheck = WrappedComponent => props => {
  return (
    <NetworkConsumer>
      { networkProps => (
        <WrappedComponent {...props} {...networkProps} />
      )}
    </NetworkConsumer>
  )
}
