import React from 'react'
import TextField from '@material-ui/core/TextField'
import Icon from '@material-ui/core/Icon'
import moment from 'moment'

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
  }
}

class AddSearch extends React.Component {
  renderValue = (value) => {
    const { type } = this.props
    switch (type) {
      case 'date':
        return moment(value).format('YYYY-MM-DD')
      default:
        return value
    }
  }

  render () {
    const {
      classes,
      onChange,
      type = 'text',
      label,
      multiline,
      row,
      name,
      field,
      disabled,
      required,
      rows,
      ...rest
    } = this.props

    return (
      <section className='searchbar'>
        <TextField
          placeholder='Search...'
          id={field.name}
          value={this.renderValue(field.value) || ''}
          onChange={onChange || field.onChange}
          onKeyPress={rest.onKeyPress}
          onBlur={rest.onBlur || field.onBlur}
          maxLength={100}
          type={type}
          disabled={disabled}
          multiline={multiline}
          rows={rows}
        />
        <Icon style={styles.searchIcon}>search</Icon>
      </section>
    )
  }
}

export default AddSearch
