import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import TagFacesIcon from '@material-ui/icons/TagFaces'
import Modal from '../../../../components/Modal'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2
  },
  chip: {
    margin: theme.spacing.unit / 2,
    backgroundColor: '#86C2CC',
    color: 'white'
  }
})
class ChipsArray2 extends React.Component {
  state = {
    chipData: [
      { key: 0, label: 'Brand1' },
      { key: 1, label: 'Brand2' }
    ],
    isOpenModel: false
  }
  handleCloseModel = () => {
    this.setState({ isOpenModel: false })
  }

  handleDelete = data => () => {
    this.setState(state => {
      const chipData = [...state.chipData]
      const chipToDelete = chipData.indexOf(data)
      chipData.splice(chipToDelete, 1)
      return {
        chipData,
        isOpenModel: true
      }
    })
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        {this.state.chipData.map(data => {
          let avatar = null

          if (data.label === 'React') {
            avatar = (
              <Avatar>
                <TagFacesIcon className={classes.svgIcon} />
              </Avatar>
            )
          }

          return (
            <Chip
              key={data.key}
              avatar={avatar}
              label={data.label}
              onDelete={this.handleDelete(data)}
              className={classes.chip}
            />
          )
        })}
        <Modal isOpen={this.state.isOpenModel} handleClose={this.handleCloseModel}>
          <p>Why would you want to delete?</p>
        </Modal>
      </div>
    )
  }
}
ChipsArray2.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(ChipsArray2)
