import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'

import MySnackbarContentWrapper from './content'

class CustomizedSnackbars extends React.Component {
  state = {
    open: true
  };

  _handleClose = (event, reason) => {
    const { handleClose } = this.props
    if (reason === 'clickaway') {
      return
    }
    if (handleClose) handleClose()
    this.setState({ open: false })
  };

  render () {
    const {
      autoHideDuration = 6000,
      variant,
      message
    } = this.props
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          open={this.state.open}
          autoHideDuration={autoHideDuration}
          onClose={this._handleClose}
        >
          <MySnackbarContentWrapper
            onClose={this._handleClose}
            variant={variant}
            message={message}
          />
        </Snackbar>
      </div>
    )
  }
}

CustomizedSnackbars.propTypes = {
  message: PropTypes.string,
  handleClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired
}

export default CustomizedSnackbars
