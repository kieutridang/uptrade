import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { MUTATION_CREATE_PRODUCTS } from '../products.typedef'
import { QUERY_COMPANY } from '../../SuperAdmin/Clients/client.typedef'
import Essentials from './components/Essentials'
import Supplier from './components/Supplier'
import Descriptions from './components/Descriptions'
import User from './components/User'
import FormModel from '../../../components/FormModel'
import Button from '../../../components/Button'
import { productValidationSchema } from '../products.validations'
import { initialProductValues } from '../product.initialOriginalValues'
import { BlockNavigationComponent } from '../../../components/BlockNavigation'
import { QUERY_SUPPLIERS } from '../../Suppliers/supplier.typedef'

class Form extends React.Component {
  componentDidUpdate (prevProps) {
    if ((prevProps.isSubmitting && !this.props.isSubmitting) || (prevProps.isValid && !this.props.isValid)) {
      if (this.props.errors.hasOwnProperty('form') === false) {
        const keys = Object.keys(this.props.errors)
        const errorElement = document.getElementById(keys[0])
        const coordinates = errorElement.getBoundingClientRect()
        window.scrollTo(coordinates.x, coordinates.y)
      }
    }
  }
  render () {
    const {
      handleSubmit,
      errors,
      isSubmitting,
      dirty
    } = this.props
    return (
      <form onSubmit={handleSubmit} id='create-product-form'>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <div key='1'><Essentials {...this.props} /></div>
        <div key='2'><Supplier {...this.props} /></div>
        <div key='3'><Descriptions /></div>
        <div key='4'><User /></div>
        <span className='error-message'>{ errors['form'] }</span>
        <div className='text-center mb-5'>
          <Button id='create-button' typeClass='green-button' type='submit'>Create product</Button>
        </div>
      </form>
    )
  }
}

class ProductCreate extends React.Component {
  render () {
    const { getCompany, getSuppliers } = this.props
    let categoryData
    if (!getCompany.loading && getCompany.company) {
      categoryData = getCompany.company.productSettings
    }
    let suppliers = []
    if (!getSuppliers.loading && getSuppliers.companySuppliers) {
      suppliers = getSuppliers.companySuppliers.suppliers
    }
    return (
      <div style={{ padding: 24, backgroundColor: '#f5f5f5' }}>
        <QueueAnim type='bottom' className='ui-animate'>
          <FormModel
            schema={productValidationSchema}
            initialValues={initialProductValues}
            submitHandler={this.handleSubmit}
            component={<Form
              categoryDataList={categoryData}
              supplierDataList={suppliers}
            />}
          />
        </QueueAnim>
      </div>
    )
  }
  handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const { history, createProduct } = this.props
    const {
      itemStatus,
      category,
      subCategory,
      brand,
      essentialsItemNumber,
      itemName,
      MOQ,
      testCertificate,
      formAE,
      leadTime,
      sampleCost,
      sampleLeadTime,
      // imageUrl,
      supplier,
      color,
      customerItemNumber,
      exclusivity,
      shortDescription,
      longDescription,
      composition,
      internalRemark,
      marketPlaceDescription,
      customFields
      // productManager,
      // procurementManager,
      // qualityManager,
      // marketingManager
    } = values
    let formattedCustomFields = []
    if (customFields) {
      formattedCustomFields = customFields.map(item => {
        const key = Object.keys(item)[0]
        return {
          fieldName: key,
          value: item[key]
        }
      })
    }
    let supplierFilter = supplier && supplier.filter(item => item._id)
    const product = {
      essentials: {
        itemStatus,
        category,
        subCategory,
        brand,
        itemNumber: essentialsItemNumber,
        itemName,
        MOQ,
        testCertificate: testCertificate,
        formAE,
        leadTime,
        sampleCost,
        sampleLeadTime,
        customFields: formattedCustomFields
        // imageUrl,
      },
      supplier: supplierFilter,
      descriptions: {
        color,
        customerItemNumber,
        exclusivity,
        shortDescription,
        longDescription,
        composition,
        internalRemark,
        marketPlaceDescription
      },
      users: {
        productManager: '',
        procurementManager: '',
        qualityManager: '',
        marketingManager: ''
      }
    }
    setSubmitting(true)
    try {
      const response = await createProduct({
        variables: { product }
      })

      if (response && response.data && response.data.createProduct) {
        const id = response.data.createProduct._id
        history.push(`/products/detail/${id}`)
      }
    } catch (exception) {
      const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
      setErrors({
        form: msg
      })
    }
    setSubmitting(false)
  }
}

export default compose(
  graphql(MUTATION_CREATE_PRODUCTS, { name: 'createProduct' }),
  graphql(QUERY_SUPPLIERS, {
    name: 'getSuppliers',
    options: props => {
      return {
        variables: {
          limit: -1
        }
      }
    }
  }),
  graphql(QUERY_COMPANY, {
    name: 'getCompany',
    options: props => {
      return {
        variables: {
          companyUptradeID: window.localStorage.getItem('companyUptradeID')
        }
      }
    }
  })
)(ProductCreate)
