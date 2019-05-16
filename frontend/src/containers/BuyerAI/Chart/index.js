import React from 'react'
import Highcharts from 'highcharts'
import HCBellCurve from 'highcharts/modules/histogram-bellcurve'
import HighchartsReact from 'highcharts-react-official'

HCBellCurve(Highcharts)

class Chart extends React.Component {
  render () {
    const { data } = this.props
    return (
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'chart'}
        options={data}
      />
    )
  }
}

export default Chart
