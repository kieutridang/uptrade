import React from 'react'
import PropTypes from 'prop-types'

import FormModel from '../../../../../../components/FormModel/index'
import { BlockNavigationComponent } from '../../../../../../components/BlockNavigation'
import {
  IconButton,
  Tooltip
} from '@material-ui/core'
import {
  Add as AddIcon
} from '@material-ui/icons'
import DepartmentList from './DepartmentList'

class DepartmentsForm extends React.Component {
  addNewDepartment = () => {
    let newDepartments = [
      ...this.props.values.departments,
      ''
    ]
    this.props.setFieldValue('departments', newDepartments)
    this.props.handleIncreaseDepartmentMode()
  }
  render () {
    const {
      values,
      handleSubmit,
      isSubmitting,
      dirty,
      viewDepartmentMode,
      handleToggleActiveEdit,
      setFieldValue,
      submitForm
    } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <div className='box box-default'>
          <div className='box-header'>
            Departments
            <ul className='list-unstyled list-inline headericons float-right'>
              <li className='list-inline-item' onClick={this.addNewDepartment}>
                <Tooltip title='Add entry'>
                  <IconButton aria-label=''>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </li>
            </ul>
          </div>
          <div className='box-divider' />
          <div className='box-body'>
            <div className='container'>
              <DepartmentList
                values={values}
                viewDepartmentMode={viewDepartmentMode}
                handleToggleActiveEdit={handleToggleActiveEdit}
                disabledSave={isSubmitting}
                setFieldValue={setFieldValue}
                submitForm={submitForm}
              />
            </div>
          </div>
        </div>
      </form >
    )
  }
}

const DepartmentsBox = (props) => {
  const {
    viewDepartmentMode,
    handleSubmit,
    handleToggleActiveEdit,
    departments,
    handleIncreaseDepartmentMode
  } = props
  return (
    <FormModel
      initialValues={{ departments: departments, saveIndex: -1, deleteIndex: -1 }}
      submitHandler={handleSubmit}
      component={<DepartmentsForm
        viewDepartmentMode={viewDepartmentMode}
        handleToggleActiveEdit={handleToggleActiveEdit}
        handleIncreaseDepartmentMode={handleIncreaseDepartmentMode}
      />
      }
    />
  )
}

DepartmentsForm.propTypes = {
  viewDepartmentMode: PropTypes.array,
  handleSubmit: PropTypes.func,
  handleToggleActiveEdit: PropTypes.func
}

DepartmentsBox.propTypes = {
  viewDepartmentMode: PropTypes.array,
  handleToggleActiveEdit: PropTypes.func,
  handleSubmit: PropTypes.func
}

export default DepartmentsBox
