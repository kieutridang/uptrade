import React from 'react'

import { BlockNavigationComponent } from '../../../../../components/BlockNavigation'
import RadioButtons from './RadioGroup'
import ToggleEditSaveInline from '../../../../../components/InlineBars/ToggleEditSaveInline'
class NotificationForm extends React.Component {
  chooseHandler = (item, value) => {
    const { values } = this.props
    const currentNofitications = {
      ...values.notifications
    }
    currentNofitications[`${item}`] = value
    this.props.setFieldValue('notifications', currentNofitications)
  }
  render () {
    const {
      handleSubmit,
      dirty,
      isSubmitting,
      viewMode,
      handleToggleActiveEdit,
      values
    } = this.props
    const notificationsData = values.notifications
    let activeEdit
    switch (viewMode) {
      case 'show':
        activeEdit = false
        break
      case 'edit':
        activeEdit = true
        break
      default:
        activeEdit = false
        break
    }
    return (
      <form onSubmit={handleSubmit}>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <div className='box box-default'>
          <div className='box-header'>Newsletters Subscriptions
            <ToggleEditSaveInline
              title='Notifications'
              viewMode={viewMode}
              editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeNotificationEdit')}
              saveDisabled={isSubmitting || !dirty}
            />
          </div>
          <div className='box-divider' />
          <div className='box-body'>
            <div className='container'>
              <div className='row'>
                <div className='container'>
                  <div className='row bold text-center' style={{ marginTop: '20px' }}>
                    <div className='col-sm-2 text-left'>
                      Newsletter
                    </div>
                    <div className='col-sm-2'>
                      Instant
                    </div>
                    <div className='col-sm-2'>
                      Daily
                    </div>
                    <div className='col-sm-2'>
                      Weekly
                    </div>
                    <div className='col-sm-2'>
                      Monthly
                    </div>
                    <div className='col-sm-2'>
                      Unsubscribe
                    </div>
                  </div>
                  <div className='row tablestylein' style={{ marginTop: '12px' }}>
                    <RadioButtons itemName='messages' title='Messages' data={notificationsData} handleChoose={this.chooseHandler} disabled={!activeEdit} />
                  </div>
                  <div className='row tablestylein'>
                    <RadioButtons itemName='products' title='Products' data={notificationsData} handleChoose={this.chooseHandler} disabled={!activeEdit} />
                  </div>
                  <div className='row tablestylein'>
                    <RadioButtons itemName='salesStats' title='Sales Stats' data={notificationsData} handleChoose={this.chooseHandler} disabled={!activeEdit} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}
export default NotificationForm
