import React from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import Tooltip from '@material-ui/core/Tooltip'

function createData (skucategory, sku, skuimage, skuname, skuprice, skucustomer) {
  return { id: skucategory, sku, skuimage, skuname, skuprice, skucustomer }
}

function getSorting (order, orderBy) {
  return order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1)
}

const columnData = [
  { id: 'skucategory', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'sku', numeric: false, disablePadding: true, label: 'Item #' },
  { id: 'skuimage', numeric: false, disablePadding: false, label: 'Picture' },
  { id: 'skuname', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'skuprice', numeric: true, disablePadding: false, label: 'PI Price' },
  { id: 'skucustomer', numeric: false, disablePadding: false, label: 'Open to' }

]

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  };

  render () {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props

    return (
      <TableHead>
        <TableRow>
          <TableCell padding='checkbox'>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title='Sort'
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            )
          }, this)}

        </TableRow>
      </TableHead>
    )
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: 0
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: 'auto'
  }
})

class EnhancedTable extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      order: 'asc',
      orderBy: 'sku',
      selected: [],
      data: [
        createData('Kitchenware', 'BAR01', <img alt='product pic' src={require('../../../../../assets/images/demo/prod1.jpg')} />, 'Bottle opener flamingo', 0.97, 'All'),
        createData('Kitchenware', 'BAR02', <img alt='product pic' src={require('../../../../../assets/images/demo/prod2.jpg')} />, 'Bottle opener palm tree', 0.98, 'All'),
        createData('Kitchenware', 'BAR03', <img alt='product pic' src={require('../../../../../assets/images/demo/prod3.jpg')} />, 'Bottle opener pineapo', 0.96, 'All'),
        createData('Kitchenware', 'CUT001', <img alt='product pic' src={require('../../../../../assets/images/demo/prod4.png')} />, 'Heavy duty scissors', 1.53, 'All'),
        createData('Kitchenware', 'BARS01', <img alt='product pic' src={require('../../../../../assets/images/demo/prod5.png')} />, 'Cocktail set', 9.91, 'Asia + USA'),
        createData('Kitchenware', 'KS343', <img alt='product pic' src={require('../../../../../assets/images/demo/prod6.png')} />, 'Mini burger set', 10.45, 'Wallmart'),
        createData('Kitchenware', 'KB008', <img alt='product pic' src={require('../../../../../assets/images/demo/prod7.png')} />, 'Knive block - 17pces', 19.98, 'All'),
        createData('Kitchenware', 'CO001', <img alt='product pic' src={require('../../../../../assets/images/demo/prod8.jpg')} />, 'Can opener', 0.42, 'Europe'),
        createData('Kitchenware', 'K001', <img alt='product pic' src={require('../../../../../assets/images/demo/prod9.jpg')} />, 'Chef knife', 1.78, 'South America'),
        createData('Kitchenware', 'K002', <img alt='product pic' src={require('../../../../../assets/images/demo/prod10.jpg')} />, 'Santoku', 1.78, 'All'),
        createData('Kitchenware', 'K003', <img alt='product pic' src={require('../../../../../assets/images/demo/prod11.jpg')} />, 'Vegetable knife', 1.65, 'All'),
        createData('Kitchenware', 'K004', <img alt='product pic' src={require('../../../../../assets/images/demo/prod12.jpg')} />, 'Bread knife', 1.71, 'Europe + Asia'),
        createData('Kitchenware', 'K005', <img alt='product pic' src={require('../../../../../assets/images/demo/prod13.jpg')} />, 'Steak knife', 1.12, 'Carrefour'),
        createData('Kitchenware', 'K006', <img alt='product pic' src={require('../../../../../assets/images/demo/prod14.jpg')} />, 'Utility knife', 1.08, 'All'),
        createData('Kitchenware', 'K007', <img alt='product pic' src={require('../../../../../assets/images/demo/prod15.jpg')} />, 'Paring knife', 1.05, 'All')
      ],
      page: 0,
      rowsPerPage: 10
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }
    this.setState({ order, orderBy })
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }))
      return
    }
    this.setState({ selected: [] })
  };

  handleClick = (event, id) => {
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

  handleChangePage = (event, page) => {
    this.setState({ page })
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render () {
    const { classes } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>

          <Table className={classes.table + 'table-responsive tableproducts'} aria-labelledby='tableTitle'>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n, index) => {
                  const isSelected = this.isSelected(n.id)
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role='checkbox'
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isSelected}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component='th' scope='row' padding='none'>Kitchenware</TableCell>
                      <TableCell padding='none' >{n.sku}</TableCell>
                      <TableCell >{n.skuimage}</TableCell>
                      <TableCell padding='none' >{n.skuname}</TableCell>
                      <TableCell numeric>{n.skuprice}</TableCell>
                      <TableCell padding='none'>{n.skucustomer}</TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component='div'
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    )
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EnhancedTable)
