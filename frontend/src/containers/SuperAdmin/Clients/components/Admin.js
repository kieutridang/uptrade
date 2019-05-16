import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import QueueAnim from 'rc-queue-anim'

import UserBarCard from '../../../../components/InlineBars/UserBarCard'
import BoxModel from './BoxModel'
import AddSearch from '../../../../components/SearchBars/AddSearch'
import Helper from '../../../../Helper'

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
    marginTop: '15px'
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
  }

})

function Admin (props) {
  const {
    classes,
    adminList,
    openNewProfileFormHandler,
    openEditProfileFormHandler
  } = props

  return (
    <BoxModel
      header='Admin'
    >
      <div className='container'>
        <AddSearch
          addNewHandler={() => openNewProfileFormHandler('admin')}
        />
        <div className='row'>
          <QueueAnim type='bottom' className='ui-animate row client-item-sub'>
            {
              adminList.map(profile =>
                <div className='col-sm-3' key={profile._id}>
                  <Card className={classes.card}>
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
                    <CardActions className={classes.profileaction}>
                      <UserBarCard
                        className='userprofileicon'
                        editHandler={() => openEditProfileFormHandler(profile._id, 'admin')}
                        // deleteUserHandler={() => deleteUserHandler(profile)}
                      />
                    </CardActions>
                  </Card>
                </div>

              )
            }
          </QueueAnim>
        </div>
      </div>
    </BoxModel>
  )
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Admin)
