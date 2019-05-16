// vendors
import React, { Component } from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'

const style = {
  select: {
    color: 'rgba(0,0,0, 0.87)'
  }
}
class CustomizedSelect extends Component {
  render () {
    const {
      className,
      label,
      onBlur,
      callback,
      relatedFieldName,
      field,
      required,
      options = [],
      disabled,
      form: {
        errors,
        touched,
        setFieldValue
      },
      ...rest
    } = this.props

    return (
      <FormControl className='select-field'>
        <InputLabel htmlFor={field.name}>{label}</InputLabel>
        <Select
          disableUnderline
          id={field.name}
          style={style.select}
          value={field.value || ''}
          onChange={(option) => {
            if (option) {
              setFieldValue(field.name, option.target.value)

              if (onBlur) {
                setTimeout(() => onBlur(), 100) // setFieldValue is async func because of setState(values)
              }

              if (callback && relatedFieldName) {
                callback(option)
                setTimeout(() => onBlur(relatedFieldName), 100)
              }
            }
          }}
          disabled={disabled}
          onKeyPress={rest.onKeyPress}
          input={<Input name={label} id={field.name} />}
          autoWidth
        >
          <MenuItem value='' disabled key='choose'>Choose here...</MenuItem>
          { options.map((option, i) => <MenuItem key={i} value={option.value}>{option.text}</MenuItem>) }
        </Select>
        <span className='error-message'>{ touched[field.name] && errors[field.name] }</span>
      </FormControl>
    )
  }
}

export default CustomizedSelect
