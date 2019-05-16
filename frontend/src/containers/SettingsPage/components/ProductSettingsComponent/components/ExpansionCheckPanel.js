import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  Grid,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Title from './Title'
import Checkbox from '../../../../../components/CheckBox'

const styles = {
  expansionPanelSummary: {
    height: 30
  },
  expansionCheckPanel: {
    padding: 10
  },
  panelHeading: {
    display: 'flex',
    width: '100%',
    'alignItems': 'center',
    'justify-content': 'space-between !important'
  },
  itemLabel: {
    display: 'inline-block',
    paddingBottom: 12
  },
  itemContainer: {
    padding: 30
  },
  itemWrapper: {
    height: 30,
    padding: 5
  }
}

class ExpansionCheckPanel extends React.Component {
  state = {
    expanded: null
  }
  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    })
  };
  render () {
    const { classes, title, panelList, key } = this.props
    const { expanded } = this.state
    return (
      <Grid
        container
        direction='column'
        className={classes.expansionCheckPanel}
      >
        <Title title={title} />
        {
          panelList.map((panel, index) => {
            const { heading, check, itemList } = panel
            const panelKey = `${key}-panel-${index}`
            return (
              <ExpansionPanel expanded={panelKey === expanded} onChange={this.handleChange(panelKey)} key={panelKey}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.expansionPanelSummary}>
                  <div className={classes.panelHeading}>
                    <Typography className={classes.panelHeading}>{heading}</Typography>
                    <Checkbox checked={check} color='green' styles={{ float: 'right' }} />
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container direction='row' spacing={40} className={classes.itemContainer}>
                    {
                      itemList.map((item, index) => {
                        const { itemLabel, check } = item
                        return (
                          <Grid item xs={6} key={`${panelKey}-item-${index}`} className={classes.itemWrapper}>
                            <Grid container justify='space-between' alignItems='center'>
                              <Typography className={classes.itemLabel}>{itemLabel}</Typography>
                              <Checkbox checked={check} color='green' />
                            </Grid>
                          </Grid>
                        )
                      })
                    }
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )
          })
        }
      </Grid>
    )
  }
}

ExpansionCheckPanel.propTypes = {
  title: PropTypes.string,
  panelList: PropTypes.array,
  key: PropTypes.string
}

ExpansionCheckPanel.defaultProps = {
  panelList: []
}

export default withStyles(styles)(ExpansionCheckPanel)
