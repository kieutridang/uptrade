import React from 'react'
import { Field } from 'formik'
import PropTypes from 'prop-types'

import { ComponentLoading } from '../../../../../../components/Loading'
import BoxHeader from '../../../boxHeader'
import FormModel from '../../../../../../components/FormModel/index'
import Select from '../../../../../../components/Select'
import CheckBox from '../../../../../../components/CheckBox'
import { BlockNavigationComponent } from '../../../../../../components/BlockNavigation'

const accountTypeOptions = [
  { text: 'Admin', value: 'ADMIN' },
  { text: 'Director', value: 'DIRECTOR' },
  { text: 'Manager', value: 'MANAGER' },
  { text: 'Executive', value: 'EXECUTIVE' },
  { text: 'Intern', value: 'INTERN' }
]
const optionList = ['view', 'edit', 'delete', 'download', 'upload']
class AccessRightsForm extends React.Component {
  handleClickOption = (position, actionType, optionType) => {
    const { values } = this.props
    const currentAccessRights = [
      ...values.accessRights
    ]
    let currentOption = currentAccessRights[position][`${actionType}`][`${optionType}`]
    currentAccessRights[position][`${actionType}`][`${optionType}`] = !currentOption
    this.props.setFieldValue('accessRights', currentAccessRights)
  }
  createAccessRightItem = (actionType, optionType, activeEdit) => {
    let data = this.props.values.accessRights
    let position = -1
    data.forEach((element, index) => {
      if (element.accountType === this.props.values.accountType) {
        position = index
      }
    })
    return (
      <div className='col-sm-2' key={`accessRight-${position}-${actionType}-${optionType}`}>
        <CheckBox color='green'
          disabled={!activeEdit}
          checked={data[position][`${actionType}`][`${optionType}`]}
          handleClick={() => { this.handleClickOption(position, actionType, optionType) }}
        />
      </div>
    )
  }
  renderListCheckBox = (actionText, actionType, activeEdit) => {
    let list = optionList.map((optionType) => {
      return this.createAccessRightItem(actionType, optionType, activeEdit)
    })
    return (
      <div className='row tablestyle text-center'>
        <div className='col-sm-2'><p>{actionText}</p></div>
        {list}
      </div>
    )
  }
  render () {
    const {
      viewAccessRightMode,
      handleSubmit,
      handleToggleActiveEdit,
      isSubmitting,
      dirty,
      values
    } = this.props
    let activeEdit
    if (viewAccessRightMode === 'edit') {
      activeEdit = true
    } else {
      activeEdit = false
    }
    if (values.accessRights) {
      return (
        <form onSubmit={handleSubmit}>
          <BlockNavigationComponent open={dirty && !isSubmitting} />
          <div className='box box-default'>
            <BoxHeader
              text='Access Rights'
              activeEdit={activeEdit}
              handleToggleActiveEdit={() => {
                handleToggleActiveEdit('toggleAccessRightMode', 'edit')
                this.props.setFieldValue('isEdit', true)
              }}
            />
            <div className='box-body mt-4'>
              <div className='container'>
                <div className='row'>
                  <div className='col-sm-3 no-padding'>
                    <Field
                      name='accountType'
                      label='Account Type'
                      component={Select}
                      disabled={!activeEdit}
                      options={accountTypeOptions}
                    />
                  </div>
                </div>
                <div className='row bold text-center'>
                  <div className='col-sm-2'>Feature</div>
                  <div className='col-sm-2'>View</div>
                  <div className='col-sm-2'>Edit</div>
                  <div className='col-sm-2'>Delete</div>
                  <div className='col-sm-2'>Download</div>
                  <div className='col-sm-2'>Upload</div>
                </div>
                {this.renderListCheckBox('Offers', 'offers', activeEdit)}
                {this.renderListCheckBox('Products', 'products', activeEdit)}
                {this.renderListCheckBox('Sale Stats', 'saleStats', activeEdit)}
              </div>
            </div>
          </div>
        </form >
      )
    } else {
      return (<ComponentLoading />)
    }
  }
}

const AccessRightsBox = (props) => {
  const {
    handleSubmit,
    handleToggleActiveEdit,
    accessRights,
    viewAccessRightMode
  } = props
  var cloneAccessRights = JSON.parse(JSON.stringify(accessRights))
  return (
    <FormModel
      initialValues={{ accessRights: cloneAccessRights, accountType: 'MANAGER', isEdit: false }}
      submitHandler={handleSubmit}
      component={<AccessRightsForm
        handleToggleActiveEdit={handleToggleActiveEdit}
        viewAccessRightMode={viewAccessRightMode}
      />
      }
    />
  )
}

AccessRightsBox.propTypes = {
  viewAccessRightMode: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleToggleActiveEdit: PropTypes.func
}

export default AccessRightsBox
