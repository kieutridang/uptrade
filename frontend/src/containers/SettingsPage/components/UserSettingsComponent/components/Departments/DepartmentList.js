import React from 'react'
import {
  List
} from '@material-ui/core'
import { Item, ConstItem } from './Item'
import { FieldArray } from 'formik'

class DepartmentList extends React.Component {
  createItem = (name, index) => {
    var activeEdit = this.props.viewDepartmentMode[index] === 'edit'
    if (name === 'Misc. (default)') {
      return (
        <ConstItem index={index} key={`department-${index}`} />
      )
    }
    return (
      <Item
        key={`department-${index}`}
        index={index}
        activeEdit={activeEdit}
        handleToggleActiveEdit={this.props.handleToggleActiveEdit}
        disabledSave={this.props.disabledSave}
        setFieldValue={this.props.setFieldValue}
        submitForm={this.props.submitForm}
        values={this.props.values}
      />
    )
  }
  createColList = (list, begin, end) => {
    let itemList = []
    for (var i = begin - 1; i >= end; i--) {
      itemList.push(this.createItem(list[i], i))
    }
    return (
      <List dense={false}>
        {itemList}
      </List>
    )
  }
  render () {
    const {
      values
    } = this.props
    const length = values.departments.length
    const half = (length - length % 2) / 2
    return (
      <FieldArray
        name='departments'
        render={() => (
          <div className='row'>
            {/* create list from length -> 0 */}
            <div className='col-sm-6 col-lg-5 divright'>
              {this.createColList(values.departments, length, half)}
            </div>
            <div className='col-sm-6 col-lg-5'>
              {this.createColList(values.departments, half, 0)}
            </div>
          </div>
        )}
      />
    )
  }
}

export default DepartmentList
