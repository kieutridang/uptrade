import React from 'react'
import {
  Paper,
  Divider,
  Typography,
  Grid
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import ExpansionCheckPanel from './ExpansionCheckPanel'

const styles = {
  header: {
    'font-size': '0.875rem',
    'font-weight': 'bold'
  },
  requiredField: {
    padding: '20px',
    'margin-top': '20px'
  },
  divider: {
    margin: '15px'
  }
}

const sourcingProductList = [
  { heading: 'Essentials',
    check: true,
    itemList: [
      { itemLabel: 'Category', check: true },
      { itemLabel: 'Sub Category', check: true },
      { itemLabel: 'Item Number', check: true },
      { itemLabel: 'Item Name', check: true },
      { itemLabel: 'Origin', check: true },
      { itemLabel: 'Currency', check: true },
      { itemLabel: 'Price', check: true },
      { itemLabel: 'Selling Unit', check: true }
    ]
  },
  {
    heading: 'Supplier',
    check: false,
    itemList: [
      { itemLabel: 'Supplier', check: true },
      { itemLabel: 'Supplier contact name', check: true },
      { itemLabel: 'Item #', check: true },
      { itemLabel: 'Supplier contact', check: true }
    ]
  },
  {
    heading: 'Descriptions',
    check: true,
    itemList: [
      { itemLabel: 'Brand Name', check: true },
      { itemLabel: 'Short Description', check: true },
      { itemLabel: 'Color', check: false },
      { itemLabel: 'Long Description', check: true },
      { itemLabel: 'Customer Item number', check: true },
      { itemLabel: 'Remark', check: true },
      { itemLabel: 'Exclusivity', check: false },
      { itemLabel: 'Sales Pitch', check: true }
    ]
  },
  {
    heading: 'Users',
    check: true,
    itemList: [
      { itemLabel: 'Product Manager', check: true },
      { itemLabel: 'Quality Manager', check: true },
      { itemLabel: 'Procurement Manager', check: true },
      { itemLabel: 'Marketing Manager', check: true }
    ]
  }
]

class RequiredField extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <Paper className={classes.requiredField}>
        <Typography className={classes.header}>Required Fields</Typography>
        <Divider variant='inset' className={classes.divider} />
        <Grid
          container
          direction='column'
          spacing={16}
        >
          <ExpansionCheckPanel
            title='Sourcing Products'
            panelList={sourcingProductList}
            key='sourcing-product'
          />
          <ExpansionCheckPanel
            title='Permanent Products'
            panelList={sourcingProductList}
            key='permanent-product'
          />
        </Grid>
      </Paper>
    )
  }
}

export default withStyles(styles)(RequiredField)
