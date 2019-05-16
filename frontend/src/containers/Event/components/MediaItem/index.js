import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Helper from '../../../../Helper'

const styles = {
  card: {
    maxWidth: 'calc(25vw - 110px)',
    minWidth: 'calc(25vw - 110px)'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  redButton: {
    color: 'white',
    background: '#DB5461',
    minHeight: '31px',
    fontSize: '90%',
    marginTop: '10px',
    marginRight: '-10px',
    padding: '4px 8px',
    minWdth: '64px'
  },
  blueButton: {
    color: '#00B9AE',
    background: 'white',
    minHeight: '31px',
    fontSize: '90%',
    fontWeight: 'bold',
    margin: '-25px 0px 0px auto'
  }
}

function SimpleMediaCard (props) {
  const { classes, data, key, history } = props
  return (
    <div className='cardright' key={key}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={Helper.generateImageURL(data.imageUrl)}
          title={data.name}
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h3' className='cardtitle'>
            <Link className='to-parameters-link' to={`/events/parameters/${data._id}`}>{data.name}</Link>
          </Typography>
          <Typography component='p' className='cardp'>
            {data.startDate && data.endDate && `${Helper.getFormattedDate(data.startDate)} - ${Helper.getFormattedDate(data.endDate)}`}
          </Typography>
          <Typography component='p' className='cardp'>
            {data.products && data.products.length > 0 && <Button size='small' onClick={() => { history.push(`/events/${data._id}/products`) }} className={classes.redButton}>{`${data.products.length} items`}</Button>}
          </Typography>
        </CardContent>
        <CardActions>
          {data.country && <Button size='small' style={styles.blueButton}>
            {data.country}
          </Button>}
        </CardActions>
      </Card>
    </div>
  )
}

SimpleMediaCard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SimpleMediaCard)
