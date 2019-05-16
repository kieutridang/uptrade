import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import QueueAnim from 'rc-queue-anim'
import { graphql } from 'react-apollo'

import { QUERY_SUPPLIER } from '../../supplier.typedef'
import { ComponentLoading } from '../../../../components/Loading'
import UserBarCardPublic from '../../../../components/InlineBars/UserBarCardPublic'
import FilterBar from '../../../../components/SearchBars/FilterBar'
import Helper from '../../../../Helper'

const styles2 = theme => ({
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

function PinnedSubheaderList (props) {
  const { classes, profiles } = props

  return (
    <div className='container'>
      <FilterBar />
      <div className='row'>
        <QueueAnim type='bottom' className='ui-animate row client-item-sub'>
          {
            profiles && profiles.map(profile =>
              <div className='col-sm-3' key={profile._id.toString()}>
                <Card className={classes.card}>
                  <div className='container'>
                    <div className='row'>
                      <div className='col-sm-4 no-padding'>
                        <img src={Helper.generateImageURL(profile.avatar)} className={classes.profileimg} alt='avatar' />
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
                  <CardActions className={classes.profileaction}>
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

PinnedSubheaderList.propTypes = {
  classes: PropTypes.object.isRequired
}

const Userslist = withStyles(styles2)(PinnedSubheaderList)

class Users extends React.Component {
  render () {
    const { getSupplier } = this.props
    if (getSupplier.loading) {
      return <ComponentLoading />
    } else {
      return (
        <article className='article products closebox'>
          <div className='row article-notitle'>
            <div className='col-sm-12'>
              <div className='box box-default'>
                <div className='box-header'>Users</div>
                <div className='box-divider' />
                <div className='box-body' style={{ paddingBottom: '20px' }}>
                  <div className='container'>
                    <div className='row'>
                      <Userslist profiles={getSupplier.supplier._company._users} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      )
    }
  }
}
export default graphql(QUERY_SUPPLIER, {
  name: 'getSupplier',
  options: props => {
    return {
      variables: {
        id: props.match.params.id
      }
    }
  }
})(Users)
