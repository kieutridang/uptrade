import React from 'react'
import Prompt from '../Prompt'

const BlockReloadWindowComponent = (open) => {
  if (open) {
    // can't custom message because custom messages in onbeforeunload dialogs (removed this feature custom)
    window.onbeforeunload = () => true
  } else {
    window.onbeforeunload = undefined
  }
}
class BlockNavigationComponent extends React.Component {
  componentWillUnmount = () => {
    window.onbeforeunload = undefined
  }
  render () {
    BlockReloadWindowComponent(this.props.open)
    return (
      <Prompt open={this.props.open} message='Changes are not saved, confirm?' />
    )
  }
}

export {
  BlockNavigationComponent,
  BlockReloadWindowComponent
}
