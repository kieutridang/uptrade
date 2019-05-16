// vendors
import React, { Component } from 'react'
import FormControl from '@material-ui/core/FormControl'
import Select from 'react-select'

class CustomizedSelect extends Component {
  render () {
    const {
      className,
      label,
      field,
      onBlur,
      callback,
      relatedFieldName,
      options = [],
      isLoading,
      onChange,
      form: {
        errors,
        touched,
        setFieldValue
      },
      value
    } = this.props

    return (
      <FormControl className='select-field'>
        <label htmlFor={field.name}>{label}</label>
        <Select
          className={className}
          data-cy={`${field.name}`}
          id={field.name}
          isLoading={isLoading}
          value={value || ''}
          onChange={(option) => {
            onChange(option)
            // if (option) {
            setFieldValue(field.name, option.value)

            if (onBlur) {
              setTimeout(() => onBlur(), 100) // setFieldValue is async func because of setState(values)
            }

            if (callback && relatedFieldName) {
              callback(option)
              setTimeout(() => onBlur(relatedFieldName), 100)
            }
            // }
          }}
          options={options}
        />
        <span className='error-message'>{ touched[field.name] && errors[field.name] }</span>
      </FormControl>
    )
  }
}

export default CustomizedSelect
