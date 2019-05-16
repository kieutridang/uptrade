import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import QueueAnim from 'rc-queue-anim'
import TextField from '@material-ui/core/TextField'
import Icon from '@material-ui/core/Icon'
import Helper from '../../../../Helper'

import Button from '../../../../components/Button'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 565
  },
  listSection: {
    backgroundColor: 'inherit'
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0
  },
  card: {
    height: '72px',
    paddingTop: '5px',
    paddingBottom: '5px',
    marginTop: '15px',
    cursor: 'pointer'
  },
  cardActive: {
    height: '72px',
    paddingTop: '4.5px',
    paddingBottom: '4.5px',
    marginTop: '15px',
    border: '1px solid #00B9AE',
    cursor: 'pointer'

  },
  cardDisabled: {
    height: '72px',
    paddingTop: '4.5px',
    paddingBottom: '4.5px',
    marginTop: '15px',
    pointerEvents: 'none',
    cursor: 'not-allowed',
    opacity: 0.7
  },
  profileimg: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  profileh2: {
    fontSize: '14px',
    padding: '5px 0'
  },
  profilep: {
    color: 'grey',
    fontSize: '12px'
  },
  profilep2: {
    color: 'grey',
    fontSize: '10px'
  },
  profileaction: {
    borderTop: 'solid 1px #e9e9e9',
    paddingBottom: '0',
    paddingTop: '5px'
  },
  greenButton: {
    color: 'white',
    background: '#00B9AE',
    minHeight: '31px',
    fontSize: '80%',
    marginTop: '-5px'
  }

})

class AddUserForm extends React.Component {
  constructor () {
    super()
    this.state = {
      IDOfCardActive: []
    }
  }

  handleChooseToggle = cardID => {
    let currentIDOfCardActive = this.state.IDOfCardActive
    if (!this.state[`cardActive_${cardID}`]) {
      currentIDOfCardActive.push(cardID)
    } else {
      currentIDOfCardActive = currentIDOfCardActive.filter(card => card !== cardID)
    }
    this.setState({
      [`cardActive_${cardID}`]: !this.state[`cardActive_${cardID}`],
      IDOfCardActive: currentIDOfCardActive
    })
  }

  handleAddNewUser = () => {
    const newUserIDArray = this.state.IDOfCardActive
    const usersList = this.props.usersOfCompany
    newUserIDArray.forEach(item => {
      const newUser = usersList.find(user => {
        return user._id === item
      })
      this.props.helperArray.push(newUser)
    })
    this.props.handleModalClose()
  }

  render () {
    const {
      classes,
      userOfParticipants,
      usersOfCompany
    } = this.props
    let listUsersOfCompany = []
    listUsersOfCompany = usersOfCompany && usersOfCompany.filter((item) => !userOfParticipants.includes(item._id))
    return (
      <div className='container'>
        <section className='searchbar'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-6 buttons-row nopadding'>
                <Button
                  disabled={this.state.IDOfCardActive.length < 1}
                  className={`btn-w-sm ${classes.greenButton}`}
                  handleClick={this.handleAddNewUser}
                >
                  ADD USER
                </Button>
              </div>
              <div className='col-md-6'>
                <Icon className='float-right' style={styles.searchIcon}>search</Icon>
                <TextField className='float-right'
                  placeholder='Search...'
                />
              </div>
            </div>
          </div>
        </section>
        <div className='row'>
          <QueueAnim type='bottom' className='ui-animate row client-item-sub'>
            {
              listUsersOfCompany && listUsersOfCompany.map(profile => {
                let cardClassName = this.state[`cardActive_${profile._id}`] ? classes.cardActive : classes.card
                return (
                  <div className='col-sm-6' key={profile._id} onClick={() => this.handleChooseToggle(profile._id)}>
                    <Card className={cardClassName} >
                      <div className='container'>
                        <div className='row'>
                          <div className='col-sm-4 no-padding'>
                            <img src={Helper.generateImageURL(profile.avatar)} className={classes.profileimg} alt='avatar' />
                          </div>
                          <div className='col-sm-8'>
                            <Typography variant='h5' component='h2' className={classes.profileh2}>
                              <span>{profile.firstName} {profile.lastName}</span>
                            </Typography>
                            <Typography component='p' className={classes.profilep}>
                              <span>{profile.position}</span>
                            </Typography>
                            <Typography component='p' className={classes.profilep2}>
                              <span>{profile.email}</span>
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
        </div>
      </div>
    )
  }
}

AddUserForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AddUserForm)
