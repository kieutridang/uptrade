import React from 'react'
import {
  Grid,
  Typography,
  IconButton,
  Tooltip
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Add, Check } from '@material-ui/icons'

const styles = {
  title: {
    width: '90%',
    paddingBottom: 12
  },
  titleText: {
    'font-size': '0.875rem',
    'font-weight': '700'
  }
}

class Title extends React.Component {
  render () {
    const { classes, title, icon, primaryIcon, text, handleAddNewEntry, addDisabled } = this.props
    return (
      <Grid
        container
        direction='row'
        justify='space-between'
        alignItems='center'
        className={classes.title}
      >
        <Typography className={classes.titleText}>{ title }</Typography>
        {icon && icon === 'add' &&
          <Tooltip title={text}>
            <IconButton onClick={handleAddNewEntry} disabled={addDisabled}>
              <Add className={primaryIcon && 'icon-primary'} />
            </IconButton>
          </Tooltip>
        }
        {icon && icon === 'check' &&
          <Tooltip title={text}>
            <IconButton>
              <Check className={primaryIcon && 'icon-primary'} />
            </IconButton>
          </Tooltip>
        }
      </Grid>
    )
  }
}

Title.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  primaryIcon: PropTypes.bool
}

export default withStyles(styles)(Title)
