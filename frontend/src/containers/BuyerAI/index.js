import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { graphql } from 'react-apollo'
import { Field } from 'formik'
import { compose, withStateHandlers, withState } from 'recompose'
import { Button, CircularProgress } from '@material-ui/core'
import { QUERY_BUYERAI_DATA } from './buyerAI.typedef'
import { BlockNavigationComponent } from '../../components/BlockNavigation/index'
import { initialBuyerAIValues } from './buyerAI.initialValues'
import { buyerAIValidationSchema } from './buyerAI.validation'
import FormModel from '../../components/FormModel/index'
import Search from '../../components/SearchBars/Search'
import Slider from '../../components/Slider/index'
import Chart from './Chart'
import Select from '../../components/Select/index'
import Helper from '../../Helper/index'
import CheckBoxesGroup from './components/CheckboxesGroup/index'
import './index.scss'

const currency = [
  'EUR',
  'HKD',
  'USD'
]

let options = {
  chart: {
    type: 'area',
    height: 500,
    renderTo: 'container',
    defaultSeriesType: 'column',
    borderWidth: 0,
    plotBackgroundColor: 'white',
    plotBorderWidth: 0.5
  },
  title: {
    text: 'Bell curve'
  },
  xAxis: {
    title: {
      text: 'Price'
    },
    labels: {
      y: 40,
      style: {
        fontSize: '8px',
        fontWeight: 'normal',
        color: 'black'
      }
    },
    alignSticks: false,
    lineWidth: 0,
    lineColor: 'black',
    tickLength: 10
  },
  yAxis: {
    title: {
      text: 'Price repartition'
    },
    tickLength: 5,
    max: 1
  },
  tooltip: {
    shared: true,
    useHTML: true,
    headerFormat: '<b>{point.key}</b><br/><br/><table>',
    pointFormat: '<tr><td style="color: {series.color}">Price:</td>' +
        '<td style="text-align: right"><b> {point.x}</b></td></tr>' +
        '<tr>Price repartition:<td></td><b> {point.y}<b><td></td></tr>',
    footerFormat: '</table>',
    valueDecimals: 2
  },
  plotOptions: {
    column: {
      shadow: false,
      borderColor: 'black',
      pointPadding: 0,
      groupPadding: 0,
      maxPointWidth: 10,
      color: '#DB5461',
      dataLabels: {
        enabled: true
      }
    },
    spline: {
      shadow: false,
      marker: {
        enabled: false
      }
    }
  },
  series: [{
    name: 'Curve',
    type: 'areaspline',
    marker: {
      enabled: false
    },
    data: []
  }, {
    name: 'Bars',
    type: 'column',
    data: [],
    dataLabels: {
      format: '{point.name}'
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<b>{point.key}</b><br/><br/><table>',
      pointFormat: '<tr><td style="color: {series.color}">Price:</td>' +
          '<td style="text-align: right"><b> {point.x}</b></td></tr>',
      footerFormat: '</table>',
      valueDecimals: 2
    }
  }]
}

class BuyerAISubmitForm extends React.Component {
  render () {
    const {
      values,
      setFieldValue,
      maxPrice,
      handleSubmit,
      isSubmitting,
      buyerAIData
    } = this.props
    const { margin, price } = values
    const currencyOptions = Helper.createOptionsOfSelect(currency)

    return (
      <form onSubmit={handleSubmit}>
        <BlockNavigationComponent open={!isSubmitting} />
        <h2 className='article-title page-title'>Buyer AI</h2>
        <div className='col-sm-6'>
          <div className='row'>
            <Field
              name='item'
              component={Search}
            />
          </div>
        </div>
        <div className='col-sm-4 col-md-3'>
          <div className='row'>
            <Field
              label='Currency'
              name='currency'
              options={currencyOptions}
              component={Select}
            />
          </div>
        </div>
        <CheckBoxesGroup
          {...this.props}
        />
        <div className='row'>
          <div className='col-md-4'>
            <div className='row'>
              <span className='col-sm-12'>Price: {price}</span>
              <Slider min={0.01} step={0.01} max={maxPrice} value={price} handler={(event) => {
                setFieldValue('price', event.target.value)
              }} />
            </div>
          </div>
          <div className='col-md-4'>
            <div className='row'>
              <span className='col-sm-12'>Margin: {margin}</span>
              <Slider min={0} max={100} step={1} value={margin} handler={(event) => {
                setFieldValue('margin', event.target.value)
              }} />
            </div>
          </div>
          <div className='col-md-4'>
            {isSubmitting
              ? <CircularProgress />
              : <Button
                onClick={handleSubmit}
                type='submit'
                color='primary'
              >
                <span>Show</span>
              </Button>
            }
          </div>
        </div>
        <QueueAnim type='bottom' className='ui-animate'>
          <Chart data={buyerAIData} />
        </QueueAnim>
        <div className='container'>
          <i><span style={{ color: 'red' }}>* The height of indicators are random to avoid being overlapped to each other</span></i>
        </div>
      </form>
    )
  }
}

class BuyerAI extends React.Component {
  render () {
    const { submitBuyerAISettingHandler } = this.props
    return (
      <section style={{ padding: 24 }}>
        <article className='article buyerAI'>
          <FormModel
            initialValues={initialBuyerAIValues}
            schema={buyerAIValidationSchema}
            submitHandler={submitBuyerAISettingHandler}
            component={<BuyerAISubmitForm
              {...this.props}
            />}
          />
        </article>
      </section>
    )
  }
}

export default compose(
  withState('item', 'setItem', 'coca'),
  withState('concurrentList', 'setConcurrentList', 'Edeka'),
  graphql(QUERY_BUYERAI_DATA, {
    name: 'getBuyerAIData'
  }),
  withState('buyerAIData', 'setBuyerAIData', options),
  withStateHandlers(
    (_) => ({}), {
      submitBuyerAISettingHandler: (_, props) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        const { getBuyerAIData, setBuyerAIData, buyerAIData } = props

        let { item, concurrentList, price, currency } = values

        item = item.replace(/ /g, '+')
        concurrentList = concurrentList.join('+')
        price = price.toString()

        try {
          const response = await getBuyerAIData.refetch({
            item: item,
            concurrentList: concurrentList,
            price: price,
            currency: currency
          })

          if (response && response.data && response.data.buyerAIFetchData) {
            const fetchData = response.data.buyerAIFetchData
            let { search } = fetchData
            let data = { ...buyerAIData }
            search = search.replace(/[+]/g, ' ')

            // create data for curve
            let dataNormal = fetchData.concurrentAnalysis.DataNormal
            let dataNormalX = dataNormal[0]
            let dataNormalY = dataNormal[1]
            let seriesData = []
            dataNormalX.forEach((item, index) => {
              let r = []
              r.push(item)
              r.push(dataNormalY[index])

              seriesData.push(r)
            })

            let curveData = data.series[0]
            curveData.data = seriesData

            // create data for bar chart
            let barData = data.series[1]
            barData.data = fetchData.concurrents.map((item, index) => {
              let q = {}
              q.x = item.mean
              q.y = parseFloat(Math.random() * (0.9 - 0.5) + 0.5) // random y
              q.name = item.companyName

              return q
            }).sort((obj1, obj2) => {
              if (obj1.x >= obj2.x) {
                return 1
              }
              return -1
            })

            setBuyerAIData({
              ...data,
              title: {
                text: `Market status for "${search}"`
              }
            })
            // resetForm()
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
  )
)(BuyerAI)
