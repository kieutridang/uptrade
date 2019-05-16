import React from 'react'
import { CSVLink } from 'react-csv'
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
  defaultButton: {
    background: 'white',
    color: '#383838',
    border: 'solid 1px rgb(235, 235, 235)',
    minHeight: '31px'
  }
}

class AddSearchUpDown extends React.Component {
  render () {
    const { addHandler, downloadHandler, downloadData, downloadHeaders, downloadFileName } = this.props
    return (
      <section className='searchbar'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8 buttons-row nopadding'>
              <Button variant='contained' style={styles.greenButton} className='btn-w-sm add-button' onClick={addHandler}><Icon style={styles.smallIcon}>add</Icon>New</Button>
              <Button variant='contained' style={styles.defaultButton} className='btn-w-sm'><Icon style={styles.smallIcon}>filter_list</Icon>Filter</Button>
              <CSVLink data={downloadData || []} headers={downloadHeaders} filename={downloadFileName} onClick={downloadHandler || (() => false)} separator={','}>
                <Button variant='contained' style={styles.defaultButton} className='btn-w-sm'><Icon style={styles.smallerIcon}>cloud_download</Icon>Download</Button>
              </CSVLink>
              <Button variant='contained' style={styles.defaultButton} className='btn-w-sm'><Icon style={styles.smallerIcon}>cloud_upload</Icon>Upload</Button>
              <Button variant='contained' style={styles.defaultButton} className=''><Icon style={styles.smallerIcon}>settings</Icon></Button>
            </div>
            <div className='col-md-4'>
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

export default AddSearchUpDown
