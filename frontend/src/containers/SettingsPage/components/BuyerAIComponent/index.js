import React from 'react'
import * as Yup from 'yup'

import FormModel from '../../../../components/FormModel/index'
import BuyAIBox from './components/BuyerAIBox'
import './index.scss'

const validationSchema = Yup.object().shape({
  uptradeId: Yup.string().required('This field is mandatory'),
  name: Yup.string().required('This field is mandatory'),
  fullName: Yup.string().required('This field is mandatory')
})

const initialValues = {
  country: 'France',
  port: 'Marseile',
  name: 'South Europe Warehouse',
  roomBuilding: 'DML Imports',
  district: '6eme arrondissement',
  city: 'Marseille',
  street: '12, avenue du Mistral',
  postCode: '13006',
  province: 'Bouches du Rhone'
}

class BuyerAIComponent extends React.Component {
  state = {
    activeEdit: false
  }
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value
    })
  };
  handleSubmit = (values) => {
    this.handleToggleActiveEdit('activeEdit')
  }
  handleToggleActiveEdit = (name) => {
    this.setState({ [name]: !this.state[name] })
  }

  render () {
    const {
      activeEdit
    } = this.state
    return (
      <article className='article products closebox settings-buyerAI'>
        <div className='row article-notitle'>
          <div className='col-sm-12'>
            <FormModel
              schema={validationSchema}
              initialValues={initialValues}
              submitHandler={this.handleSubmit}
              component={<BuyAIBox
                activeEdit={activeEdit}
                handleToggleActiveEdit={this.handleToggleActiveEdit}
              />
              }
            />
          </div>
        </div>
      </article>
    )
  }
}

BuyerAIComponent.propTypes = {

}

export default BuyerAIComponent
