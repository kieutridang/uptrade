import React from 'react'
import QueueAnim from 'rc-queue-anim'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'

import UserBarCardPublic from '../../../../components/InlineBars/UserBarCardPublic'
import FilterBar from '../../../../components/SearchBars/FilterBar'

const styles = theme => ({
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
  }
})

function UserList (props) {
  const { classes, dataList } = props
  const profiles = dataList
  return (
    <div className='container'>
      <FilterBar />
      <div className='row'>
        <QueueAnim type='bottom' className='ui-animate row client-item-sub'>
          {
            profiles && profiles.map(profile =>
              <div className='col-sm-3' key={profile._id}>
                <Card className={classes.card}>
                  <div className='container'>
                    <div className='row'>
                      <div className='col-sm-4 no-padding'>
                        <img src={profile.avatar} className={classes.profileimg} alt='avatar' />
                      </div>
                      <div className='col-sm-8'>
                        <Typography variant='h5' component='h2' className={classes.profileh2}>
                          <span>{profile.firstName}</span>
                        </Typography>
                        <Typography component='p' className={classes.profilep}>
                          <span>{profile.position}</span>
                        </Typography>
                        <Typography component='p' className={classes.profilep2}>
                          <span />
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <CardActions>
                    <UserBarCardPublic className='userprofileicon' />
                  </CardActions>
                </Card>
              </div>
            )
          }
        </QueueAnim>
      </div>
    </div>
  )
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(UserList)
