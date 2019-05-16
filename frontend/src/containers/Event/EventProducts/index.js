import React from 'react'
import classnames from 'classnames'
import QueueAnim from 'rc-queue-anim'
import { compose, withStateHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { ComponentLoading } from '../../../components/Loading'
import { QUERY_EVENT } from '../event.typedef'
import AddSearchUpDown from '../../../components/SearchBars/AddSearchUpDown'
import Helper from '../../../Helper'
import { Favorite, Check } from '@material-ui/icons'

const headers = [
  { label: 'Company name', key: 'companyName' },
  { label: 'User name', key: 'userName' },
  { label: 'Category', key: 'essentials.category' },
  { label: 'Image', key: 'essentials.imageUrl' },
  { label: 'Item name', key: 'essentials.itemName' },
  { label: 'Short description', key: 'descriptions.shortDescription' },
  { label: 'Packaging', key: '' },
  { label: 'Unit', key: '' },
  { label: 'Currency', key: 'cost.productsCost[0].currency' },
  { label: 'Factory Price', key: 'cost.productsCost[0].cost' },
  { label: 'Selling Price', key: 'cost.marketPlacePrice.cost'},
  { label: 'Incoterm', key: 'logistics.incoterm' },
  { label: 'Country', key: 'country' },
  { label: 'Port', key: 'logistics.port' },
  { label: 'MOQ', key: 'essentials.MOQ' },
  { label: 'CBM', key: 'logistics.exportCarton.volume' },
  { label: 'Carton Qty', key: '' },
  { label: 'Remark', key: '' },
  { label: 'Existing Supplier', key: '' },
  { label: 'Supplier Name', key: 'supplier[0].name' },
  { label: 'Supplier Contact', key: 'supplier[0].contactPhone' },
  { label: 'Supplier business card', key: 'supplier[0].businessCard' },
  { label: 'Created at', key: 'createdAt' },
  { label: 'Bundle name', key: '' },
  { label: 'Bundle Price', key: '' },
  { label: 'Bundle Currency', key: '' },
  { label: 'Bundle PC', key: '' },
  { label: 'Certification', key: 'certification' }
]

class ProductsEvent extends React.Component {
  renderSash = status => {
    switch (status) {
      case 'PRODUCTS':
        return (
          <div
            className={classnames('sash sash-triangle-right added-products')}
          >
            <div>
              <i className='material-icons'>
                <Check />
              </i>
              <span className='sash-text'>Added to Products</span>
            </div>
          </div>
        )
      case 'INTEREST':
        return (
          <div
            className={classnames('sash sash-triangle-right interest-product')}
          >
            <div>
              <i className='material-icons'>
                <Favorite />
              </i>
              <span className='sash-text'>Interest</span>
            </div>
          </div>
        )
      default:
        return null
    }
  };
  render () {
    const { getEvent, history, match, downloadData, handleDownloadData } = this.props

    if (getEvent.loading) {
      return <ComponentLoading />
    } else {
      const eventItem = getEvent.event
      return (
        <section style={{ padding: 24 }}>
          {eventItem && <article className='article'>
            <h2 className='article-title page-title'>{`${eventItem.name} | ${Helper.getFormattedDate(eventItem.startDate)} - ${Helper.getFormattedDate(eventItem.endDate)}`}</h2>
            <AddSearchUpDown
              addHandler={() => history.push(`/events/${match.params.id}/products/new`)}
              downloadData={downloadData}
              downloadHeaders={headers}
              downloadFileName={`${eventItem.name}-products.csv`}
              downloadHandler={handleDownloadData}
            />
            <QueueAnim type='bottom' className='ui-animate row'>
              {
                eventItem.products && eventItem.products.map(product =>
                  <div className='col-xl-3 col-lg-3 mb-4' key={product._id}>
                    <div className='item-card'>
                      {
                        this.renderSash(product.status)
                      }
                      {/* <div className={classnames('sash sash-triangle-right', product.sash)}>
                          <div>
                            <i className='material-icons'>{product.sash_icon}</i>
                            <span className='sash-text'>{product.sash_text}</span>
                          </div>
                        </div> */}
                      <Link to={`/events/${match.params.id}/products/${product._id}`} className='card__image'> {/* eslint-disable-line */}
                        <img alt='product' src={product.essentials.imageUrl ? Helper.generateImageURL(product.essentials.imageUrl[0]) : Helper.generateImageURL(product.essentials.imageUrl)} />
                      </Link>
                      <div className='card__body card-white'>
                        <div className='card__title'>
                          <span>Accessories</span>
                            <Link to={`/events/${match.params.id}/products/${product._id}`}>{product.essentials.itemName}</Link> {/* eslint-disable-line */}
                        </div>
                        <div className='card__price'>
                          <span>{`MOQ: ${product.essentials.MOQ}`}</span>
                          <span>{`US$ ${product.essentials.sampleCost}`}</span>
                        </div>
                        {product.supplier && product.supplier.map((item, index) =>
                          (
                            <div className='card__title' key={index}>
                              <Link to={`/events/${match.params.id}/products/${product._id}`} className='supname'>{item.name}</Link><br />
                              <Link to={`/events/${match.params.id}/products/${product._id}`} className='supname buyer'>Buyer 1</Link>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )
              }
            </QueueAnim>
          </article>}
        </section>
      )
    }
  }
}

export default compose(
  graphql(QUERY_EVENT, {
    name: 'getEvent',
    skip: props => !props.match.params.id,
    options: props => {
      return {
        variables: {
          id: props.match.params.id
        }
      }
    }
  }),
  withStateHandlers(
    ({
      downloadData = []
    }) => ({
      downloadData
    }), {
      handleDownloadData: (values, props) => () => {
        const { getEvent } = props
        if (!getEvent.loading) {
          try {
            const eventItem = getEvent.event || {}
            const company = _.get(eventItem, ['participants[0]', 'company'], {})
            const user = `${_.get(company, ['_admins[0]', 'firstName'], '')} ${_.get(company, ['_admins[0]', 'lastName'], '')}`
            const products = eventItem.products || []

            let productsData = products.map(item => item)
            productsData = productsData.map((item) => {
              item.essentials.imageUrl = item.essentials.imageUrl.join('\n')
              item.descriptions = _.get(item, 'descriptions', {})
              item.logistics = {
                incoterm: _.get(item, ['logistics', 'incoterm'], ''),
                port: _.get(item, ['logistics', 'port'], ''),
                exportCarton: {
                  volume: _.get(item, ['logistics', 'exportCarton', 'volume'], '')
                }
              }
              item.essentials = _.get(item, ['essentials'], {})
              item.cost = {
                productsCost: [{
                  currency: _.get(item, ['cost', 'productsCost', 0, 'currency'], ''),
                  cost: _.get(item, ['cost', 'productsCost', 0, 'cost'], 0)
                }],
                marketPlacePrice: {
                  cost: _.get(item, ['cost', 'marketPlacePrice', 'cost'], 0)
                }
              }
              item.supplier = [{
                name: _.get(item, ['supplier', 0, 'name'], ''),
                contactPhone: _.get(item, ['supplier', 0, 'contactPhone'], ''),
                businessCard: _.get(item, ['supplier', 0, 'businessCard'], '')
              }]
              item.certification = _.get(item, ['essentials', 'testCertificate'], false) ? 'Yes' : 'No'
              item.country = _.get(company, ['country'], '')
              item.companyName = _.get(company,['about', 'name'], '')
              item.userName = user

              return item
            })

            return { downloadData: productsData }
          } catch (exception) {
            console.log(exception)
            return false
          }
        } else {
          return false
        }
      }
    }
  )
)(ProductsEvent)
