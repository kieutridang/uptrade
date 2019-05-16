import React from 'react'
import Button from '@material-ui/core/Button'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import './index.scss'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
})

const styles = {
  loginButton: {
    textTransform: 'none',
    color: 'white',
    background: 'rgb(219, 84, 97)',
    fontWeight: 'normal'
  },
  greenButton: {
    color: 'white',
    background: '#00B9AE',
    minHeight: '31px'
  }
}

class ContainedButton extends React.PureComponent {
  render () {
    const {
      className,
      children,
      handleClick,
      disabled,
      typeClass,
      type,
      variant,
      disableRipple,
      id,
      style
    } = this.props

    let customClass
    switch (typeClass) {
      case 'login-button': customClass = styles.loginButton; break
      case 'green-button': customClass = styles.greenButton; break
      default: customClass = {}; break
    }
    customClass = style ? { ...customClass, ...style } : customClass

    return (
      <MuiThemeProvider theme={theme}>
        <Button
          variant={variant || 'contained'}
          className={`${className} ${customClass}`}
          style={customClass}
          id={id}
          onClick={handleClick}
          disabled={disabled}
          type={type}
          disableRipple={disableRipple}
          // {...this.props}
        >
          {children}
        </Button>
      </MuiThemeProvider>
    )
  }
}

export default ContainedButton
