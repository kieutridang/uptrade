import React, { Component } from 'react'
import Table from '../Table'
import SearchBarDownload from '../SearchBars/AddSearchDown'

class List extends Component {
  state = {};
  render () {
    const {
      fields,
      data,
      total,
      history,
      addNewHandler,
      clickRowHandler,
      handleChangePage,
      handleSelectedAllClick,
      selected
    } = this.props

    return (
      <div id='list-container'>
        <SearchBarDownload addHandler={addNewHandler} />
        <Table
          data={data}
          total={total}
          fields={fields}
          history={history}
          handleChangePage={handleChangePage}
          handleSelectedAllClick={handleSelectedAllClick}
          clickRowHandler={clickRowHandler}
          selected={selected}
        />
      </div>
    )
  }
}

export default List
