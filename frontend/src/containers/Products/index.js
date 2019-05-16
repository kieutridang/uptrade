import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'

import { QUERY_COMPANY_PRODUCTS } from './products.typedef'
// import ProductList from './ProductList'
// import AddSearchUpDown from '../../components/SearchBars/AddSearchUpDown'
import { ComponentLoading } from '../../components/Loading'
import ProductTable from '../../components/List'

const fields = [
  {
    name: 'skucategory',
    displayName: 'Category',
    inputFilterable: true,
    sortable: true
  },
  {
    name: 'sku',
    displayName: 'Item #',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'skuimage',
    displayName: 'Picture',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'skuname',
    displayName: 'Name',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'cost',
    displayName: 'Cost',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'skusupplier',
    displayName: 'Supplier',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  }
]

class Product extends React.Component {
  componentWillMount () {
    const { refetch } = this.props.getCompanyProducts
    refetch({
      page: 1,
      limit: 10,
      companyUptradeID: window.localStorage.getItem('companyUptradeID')
    })
  }
  render () {
    const {
      history,
      getCompanyProducts
    } = this.props
    if (getCompanyProducts.loading) {
      return <ComponentLoading />
    } else {
      let data = []
      let totalProducts = 0
      if (getCompanyProducts.companyProducts) {
        const { products } = getCompanyProducts.companyProducts
        totalProducts = getCompanyProducts.companyProducts.totalProducts
        products.forEach(product => {
          const { category, itemNumber, imageUrl, itemName, sampleCost } = product.essentials
          let suppliersTextArray = []
          let suppliersText = ''
          if (product.supplier) {
            product.supplier.map(supplierItem => {
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
          data.push({
            _id: product._id,
            skucategory: {
              type: 'string',
              val: category
            },
            sku: {
              type: 'string',
              val: itemNumber
            },
            skuimage: {
              type: 'image',
              val: productImgUrl
            },
            skuname: {
              type: 'string',
              val: itemName
            },
            cost: {
              type: 'string',
              val: sampleCost
            },
            skusupplier: {
              type: 'string',
              val: suppliersText
            }
          })
        })
      }
      return (
        <div style={{ padding: 24 }}>
          <QueueAnim type='bottom' className='ui-animate'>
            <div key='1'>
              <article className='article master'>
                <h2 className='article-title page-title'>Products</h2>
                {/* <AddSearchUpDown addHandler={this.addNewProductHandler} /> */}
                {/* <ProductList
                  products={products}
                  totalProducts={totalProducts}
                  handleChangePage={this.handleChangePage}
                  clickRowHandler={this.clickRowHandler}
                /> */}
                {
                  data && <ProductTable
                    history={history}
                    fields={fields}
                    data={data}
                    total={totalProducts}
                    handleChangePage={this.handleChangePage}
                    addNewHandler={this.addNewProductHandler}
                    clickRowHandler={this.clickRowHandler}
                  />
                }
                <hr />
              </article>
            </div>
          </QueueAnim>
        </div>
      )
    }
  }
  handleChangePage = (page, limit = 10) => {
    const { getCompanyProducts } = this.props
    getCompanyProducts.fetchMore({
      variables: {
        page,
        limit
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        return {
          ...previousResult,
          companyProducts: fetchMoreResult.companyProducts
        }
      }
    })
  }
  clickRowHandler = (idItem) => {
    this.props.history.push(`/products/detail/${idItem}`)
  }
  addNewProductHandler = () => {
    this.props.history.push('/products/new')
  }
}

Product.propTypes = {
  getProducts: PropTypes.object
}

export default compose(
  graphql(
    QUERY_COMPANY_PRODUCTS,
    {
      name: 'getCompanyProducts',
      options: props => {
        return {
          variables: {
            page: 1,
            limit: 10,
            companyUptradeID: window.localStorage.getItem('companyUptradeID')
          }
        }
      }
    }
  )
)(Product)
