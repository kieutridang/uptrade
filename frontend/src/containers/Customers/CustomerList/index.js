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
import { Link } from 'react-router-dom'
import AddSearchUpDown from '../../../components/SearchBars/AddSearchUpDown'

// let counter = 0;
function createData (uptradeid, name, image, category, users, status) {
  // counter += 1;
  return { id: name, uptradeid, name, image, category, users, status }
}

function getSorting (order, orderBy) {
  return order === 'desc'
    ? (a, b) => ((!a[orderBy] || (b[orderBy] < a[orderBy])) ? -1 : 1)
    : (a, b) => ((!b[orderBy] || (a[orderBy] < b[orderBy])) ? -1 : 1)
}

const columnData = [
  { id: 'uptradeID', align: 'left', disablePadding: true, label: 'UpTrade ID' },
  { id: 'name', align: 'left', disablePadding: true, label: 'Name' },
  { id: 'logo', align: 'left', disablePadding: false, label: 'Picture' },
  { id: 'categories', align: 'left', disablePadding: true, label: 'Category' },
  { id: 'usersLimit', align: 'right', disablePadding: false, label: 'Users' },
  { id: 'status', align: 'left', disablePadding: false, label: 'Status' }
]

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props
    return (
      <TableHead>
        <TableRow>
          <TableCell padding='checkbox'>
            <Checkbox
              color='primary'
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                align={column.align}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
                onClick={this.createSortHandler(column.id)}
              >
                <Tooltip
                  title='Sort'
                  placement={column.align ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
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
      orderBy: 'name',
      selected: [],
      data: [
        createData('EUTOPS', <Link to='/customers/detail/1'>Eurotops</Link>, <img alt='customerpicture' src={require('../../../assets/images/demo/carrefour.png')} />, 'Mail / Online Retailer', 10, 'Exiting'),
        createData('CARFSH', 'Carrefour Shanghai', <img alt='customerpicture' src={require('../../../assets/images/demo/carrefour.png')} />, 'Buying Office', 12, 'Prospect'),
        createData('TESCO', 'Tesco UK', <img alt='customerpicture' src={require('../../../assets/images/demo/tesco.png')} />, 'Retailer', 12, 'Prospect'),
        createData('WM', 'Walmart Shenzhen', <img alt='customerpicture' src={require('../../../assets/images/avatars/walmartlogo.jpg')} />, 'Buying Office', 53, 'Inactive'),
        createData('CASINO', 'Casino Global Sourcing ', <img alt='customerpicture' src={require('../../../assets/images/demo/cgs.png')} />, 'Buying Offcie', 90, 'Existing')
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
    const { data } = this.props
    if (checked) {
      this.setState(state => ({ selected: data.map(n => n._id) }))
      return
    }
    this.setState({ selected: [] })
  };

  handleClick = (event, id) => {
    event.stopPropagation()
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
    const { handleChangePage } = this.props
    const { rowsPerPage } = this.state
    this.setState({ page })
    handleChangePage(page, rowsPerPage)
  };

  handleChangeRowsPerPage = event => {
    const { handleChangePage, totalCustomers } = this.props
    let { page } = this.state
    const rowsPerPage = event.target.value
    page = Math.min(page, (Math.trunc((totalCustomers - 1) / rowsPerPage)) + 1)
    this.setState({
      page,
      rowsPerPage
    })
    handleChangePage(page, rowsPerPage)
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  preprocessData = (data = []) => {
    return data.map(customer => {
      const companyAbout = customer._company ? customer._company.about : {}
      return {
        id: customer._id,
        ...companyAbout
      }
    })
  }

  render () {
    const { classes, clickRowHandler, totalCustomers } = this.props
    const data = this.preprocessData(this.props.data)
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
              rowCount={data.length}
            />
            <TableBody>
              {data
                .sort(getSorting(order, orderBy))
                .map((n) => {
                  const isSelected = this.isSelected(n.id)
                  const categoryCell = n.categories ? n.categories.reduce((result, category) => result + '\n' + category) : ''
                  return (
                    <TableRow
                      hover
                      onClick={event => clickRowHandler(n.id)}
                      role='checkbox'
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox color='primary' checked={isSelected} onClick={event => this.handleClick(event, n.id)} />
                      </TableCell>
                      <TableCell padding='none' >{n.uptradeID}</TableCell>
                      <TableCell padding='none' >{n.name}</TableCell>
                      <TableCell >
                        <img alt='customerpicture' src={n.logo} />
                      </TableCell>
                      <TableCell className='multiple-line-cell' padding='none' >{categoryCell}</TableCell>
                      <TableCell align='right'>{n.usersLimit}</TableCell>
                      <TableCell padding='none'>{n.status}</TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component='div'
          count={totalCustomers}
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

const EnhancedTable1 = withStyles(styles)(EnhancedTable)

const Section = (props) => {
  const { addHandler } = props
  return (
    <article className='article master'>
      <h2 className='article-title page-title'>Customers</h2>
      <AddSearchUpDown addHandler={addHandler} />
      <EnhancedTable1 {...props} />
    </article>
  )
}

export default Section
