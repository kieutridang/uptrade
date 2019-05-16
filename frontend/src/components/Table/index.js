import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableFooter,
  TablePagination
} from '@material-ui/core'
import CustomTableCell from './CustomTableCell'
import TablePaginationActionsWrapped from './TablePaginateAction'
import EnhancedTableHead from './EnhancedTableHead'
import Helper from '../../Helper/'
import CheckBox from '@material-ui/core/Checkbox'

const styles = theme => ({
  paper: {
    width: '100%',
    overflowX: 'auto'
  }
})

function desc (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function stableSort (array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function getSorting (order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy)
}

class ClientTable extends Component {
  state = {
    order: 'asc',
    orderBy: '',
    page: 0,
    rowsPerPage: 10,
    numSelected: 0,
    selected: []
  };

  handleChangePage = (event, page) => {
    const { handleChangePage } = this.props
    const { rowsPerPage } = this.state
    this.setState({ page })
    if (handleChangePage) {
      handleChangePage(page + 1, rowsPerPage)
    }
  };

  handleChangeRowsPerPage = event => {
    const { handleChangePage } = this.props
    const { page } = this.state
    this.setState({ rowsPerPage: event.target.value })
    if (handleChangePage) {
      handleChangePage(page + 1, event.target.value)
    }
  };

  handleClick = (id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    this.setState({ selected: newSelected })
  };

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  };

  handleSelectAllClick = event => { // should change the selected
    if (event.target.checked) {
      this.setState(state => ({ selected: this.props.data.map(n => n._id) }))
      return
    }
    this.setState({ selected: [] })
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render () {
    const { fields, data, clickRowHandler, total, classes } = this.props
    const { order, orderBy, rowsPerPage, page, selected } = this.state
    const numSelected = selected.length
    return (
      <Paper className={classes.paper}>
        <Table>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onSelectAllClick={this.handleSelectAllClick}
            onRequestSort={this.handleRequestSort}
            rowCount={data.length}
            numSelected={numSelected}
            fields={fields}
          />
          <TableBody>
            {data &&
              stableSort(data, getSorting(order, orderBy))
                .map((row) => {
                  const isSelected = this.isSelected(row._id)
                  return (
                    <TableRow key={row._id} hover data-cy={`test-user-${row._id}`} selected={isSelected}>
                      <CustomTableCell padding='checkbox' onClick={() => { this.handleClick(row._id) }}>
                        <CheckBox color='primary' checked={isSelected} />
                      </CustomTableCell>
                      {fields.map((field, columnId) => {
                        return (
                          <CustomTableCell key={columnId} onClick={() => clickRowHandler && clickRowHandler(row._id)}>
                            {
                              row && row[field.name].type === 'image' ? <img style={{ height: 55 }} src={Helper.generateImageURL(row[field.name].val)} alt='Product' /> : row[field.name].val
                            }
                          </CustomTableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={fields.length + 1}
                count={total || 100} // total-items
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActionsWrapped}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    )
  }
}

ClientTable.propTypes = {
  fields: PropTypes.array,
  data: PropTypes.array,
  selected: PropTypes.array,
  handleChangePage: PropTypes.func,
  handleChangeRowsPerPage: PropTypes.func,
  handleSelectAllClick: PropTypes.func,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ClientTable)
