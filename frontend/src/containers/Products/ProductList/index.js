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
import Helper from '../../../Helper'

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
  { id: 'skuprice', numeric: true, disablePadding: false, label: 'Cost' },
  { id: 'skusupplier', numeric: false, disablePadding: false, label: 'Supplier' }
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

  handleCheckboxClick = (event, id) => {
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
    const { rowsPerPage } = this.state
    this.props.handleChangePage(page + 1, rowsPerPage)
    this.setState({ page })
  };

  handleChangeRowsPerPage = event => {
    const { page } = this.state
    this.handleChangePage(page + 1, event.target.value)
    this.setState({ rowsPerPage: event.target.value })
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render () {
    const { classes, products, totalProducts, clickRowHandler } = this.props
    const { order, orderBy, selected, rowsPerPage, page } = this.state
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
              rowCount={products && products.length}
            />
            <TableBody>
              {products && products
                .sort(getSorting(order, orderBy))
                .map(p => {
                  const isSelected = this.isSelected(p.id)
                  const {
                    category,
                    itemNumber,
                    imageUrl,
                    itemName,
                    sampleCost
                  } = p.essentials
                  let suppliersTextArray = []
                  let suppliersText = ''
                  if (p.supplier) {
                    p.supplier.map(supplierItem => {
                      if (supplierItem.name) {
                        suppliersTextArray.push(supplierItem.name)
                      }
                      return suppliersTextArray
                    })
                    suppliersText = suppliersTextArray.join(', ')
                  }
                  let productImgUrl
                  if (imageUrl && imageUrl.length > 0) {
                    productImgUrl = imageUrl[0]
                  }
                  return (
                    <TableRow
                      hover
                      onClick={() => clickRowHandler && clickRowHandler(p._id)}
                      role='checkbox'
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={p._id}
                      selected={isSelected}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox checked={isSelected} onClick={event => this.handleCheckboxClick(event, p._id)} />
                      </TableCell>
                      <TableCell component='th' scope='row' padding='none'>{category}</TableCell>
                      <TableCell padding='none' >{itemNumber}</TableCell>
                      <TableCell padding='none' ><img src={Helper.generateImageURL(productImgUrl)} alt='Product' /></TableCell>
                      <TableCell padding='none' >{itemName}</TableCell>
                      <TableCell numeric>{sampleCost}</TableCell>
                      <TableCell padding='none'>{suppliersText}</TableCell>
                    </TableRow>
                  )
                })}
              {!products && (
                <TableRow style={{ height: 55 }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component='div'
          count={totalProducts} // total-products
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
