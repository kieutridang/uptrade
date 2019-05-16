import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import QueueAnim from 'rc-queue-anim'
import Helper from '../../../../Helper'

const styles = theme => ({
  companyList: {
    maxHeight: '500px',
    overflow: 'auto'
  },
  columnTitle: {
    fontSize: '18px',
    textAlign: 'center',
    fontWeight: '500'
  },
  card: {
    height: '72px',
    marginTop: '15px',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: 0,
    boxShadow: 'none',
    border: '3px solid #ffffff'
  },
  cardActive: {
    border: '3px solid #00B9AE'
  },
  cardDisabled: {
    height: '72px',
    marginTop: '15px',
    paddingTop: '4.5px',
    paddingBottom: '4.5px',
    pointerEvents: 'none',
    cursor: 'not-allowed',
    opacity: 0.7
  },
  profileImg: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  companyName: {
    fontSize: '14px',
    padding: '5px 0'
  }
})

class CompanyList extends React.Component {
  constructor () {
    super()
    this.state = {

    }
  }
  removeDuplicate (array) {
    let newArray = []
    array.forEach(item => {
      if (!newArray.find(val => val.companyId === item.companyId)) {
        newArray.push(item)
      }
    })
    return newArray
  }
  handleChooseToggle = cardID => {
    const { handleChooseToggle } = this.props
    this.setState({
      [`cardActive_${cardID}`]: !this.state[`cardActive_${cardID}`]
    })
    handleChooseToggle(cardID)
  }
  render () {
    const { classes, title, activeCards } = this.props
    const dataList = this.removeDuplicate(this.props.dataList)
    return (
      <QueueAnim type='bottom' className={`ui-animate client-item-sub ${classes.companyList}`}>
        <Typography component='p' className={classes.columnTitle}>
          <span>{title}</span>
        </Typography>
        {
          dataList && dataList.map((company) => {
            const { about } = company._company
            let cardClassName = activeCards[`cardActive_${company.companyId}`] ? classes.cardActive : ''
            return (
              <div key={`card${title}_${company.companyId}`} onClick={() => this.handleChooseToggle(company.companyId)}>
                <Card className={`col-sm-12 ${classes.card} ${cardClassName}`} >
                  <div className='container'>
                    <div className='row'>
                      <div className='col-sm-4 no-padding'>
                        <img src={Helper.generateImageURL(about.logo)} className={classes.profileImg} alt='avatar' />
                      </div>
                      <div className='col-sm-8'>
                        <Typography component='p' className={classes.companyName}>
                          <span>{about.name}</span>
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )
          })
        }
      </QueueAnim>
    )
  }
}

CompanyList.propTypes = {
  classes: PropTypes.object.isRequired,
  dataList: PropTypes.array,
  handleChooseToggle: PropTypes.func,
  title: PropTypes.string
}

export default withStyles(styles)(CompanyList)
