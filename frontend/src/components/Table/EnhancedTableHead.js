import React from 'react'

import PropTypes from 'prop-types'

import { TableHead, TableRow, Tooltip, TableSortLabel } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import CustomTableCell from './CustomTableCell'

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  };

  render () {
    const {
      onSelectAllClick,
      order,
      orderBy,
      fields,
      numSelected,
      rowCount
    } = this.props

    return (
      <TableHead>
        <TableRow>
          <CustomTableCell padding='checkbox'>
            <Checkbox
              color='primary'
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </CustomTableCell>
          {fields && fields.map((field, id) => {
            return (
              <CustomTableCell
                key={id}
                sortDirection={orderBy === field.name ? order : false}
              >
                <Tooltip
                  title='Sort'
                  // placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === field.name}
                    direction={order}
                    onClick={this.createSortHandler(`${field.name}`)}
                  >
                    {field.displayName}
                  </TableSortLabel>
                </Tooltip>
              </CustomTableCell>
            )
          }, this)}
        </TableRow>
      </TableHead>
    )
  }
}

EnhancedTableHead.propTypes = {
  fields: PropTypes.array,
  order: PropTypes.string,
  orderBy: PropTypes.string,
  onSelectAllClick: PropTypes.func,
  numSelected: PropTypes.number,
  rowCount: PropTypes.number
}

export default EnhancedTableHead
