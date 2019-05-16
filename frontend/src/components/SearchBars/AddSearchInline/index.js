import React from 'react'
import TextField from '@material-ui/core/TextField'
import Icon from '@material-ui/core/Icon'
import Fab from '@material-ui/core/Fab'

const styles = {
  smallIcon: {
    fontSize: '20px',
    margin: ' auto'
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
    const { clickAddHandler, disabledAddButton } = this.props
    return (
      <section className='searchbar'>
        <div className='container'>
          <div className='row'>

            <div className='col-md-6 buttons-row nopadding'>
              <Fab variant='extended' mini='true' style={styles.greenButton} aria-label='add' className='' onClick={clickAddHandler} disabled={disabledAddButton}>
                <Icon style={styles.smallIcon}>add</Icon>
              </Fab>
              <Fab variant='extended' nmini='true' style={styles.redButton} aria-label='add' className=''>
                <Icon style={styles.smallIcon}>filter_list</Icon>
              </Fab>
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
