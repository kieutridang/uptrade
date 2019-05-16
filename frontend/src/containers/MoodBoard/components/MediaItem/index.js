import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const styles = {
  card: {
    maxWidth: 300,
    marginRight: 20
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  }
}

function SimpleMediaCard (props) {
  const { data, classes } = props
  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={data.imageUrl}
          title={data.cardTitle}
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h3' className='cardtitle'>
            <Link to={data.linkHref}>{data.title}</Link>
          </Typography>
          <Typography component='p' className='cardp'>
            {data.info}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size='small' color='primary'>
            {data.btnName}
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

SimpleMediaCard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SimpleMediaCard)
