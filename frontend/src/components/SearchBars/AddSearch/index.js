import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Icon from '@material-ui/core/Icon'

const styles = {
  smallIcon: {
    fontSize: '20px'
  },
  searchIcon: {
    fontSize: '24px',
    marginTop: '8px'
  },
  smallerIcon: {
    fontSize: '16px'
  },
  greenButton: {
    color: 'white',
    background: '#00B9AE',
    minHeight: '31px'
  },
  redButton: {
    background: 'white',
    color: '#383838',
    border: 'solid 1px rgb(235, 235, 235)',
    minHeight: '31px'
  }
}

class AddSearch extends React.Component {
  render () {
    const {
      addNewHandler
    } = this.props
    return (
      <section className='searchbar'>
        <div className='container'>
          <div className='row'>

            <div className='col-md-6 buttons-row nopadding'>
              <Button variant='contained' id='add-button' style={styles.greenButton} className='btn-w-sm' onClick={addNewHandler}><Icon style={styles.smallIcon}>add</Icon>New</Button>
              <Button variant='contained' style={styles.redButton} className='btn-w-sm'><Icon style={styles.smallIcon}>filter_list</Icon>Filter</Button>
              <Button variant='contained' style={styles.redButton} className=''><Icon style={styles.smallerIcon}>settings</Icon></Button>
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
    )
  }
}

export default AddSearch
