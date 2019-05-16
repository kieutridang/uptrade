import React from 'react'

class CheckboxGroup extends React.Component {
  handleChange = event => {
    const target = event.currentTarget
    let valueArray = [...this.props.value] || []

    if (target.checked) {
      valueArray.push(target.id)
    } else {
      valueArray.splice(valueArray.indexOf(target.id), 1)
    }

    this.props.onChange(this.props.id, valueArray)
  };

  handleBlur = () => {
    // take care of touched
    this.props.onBlur(this.props.id, true)
  };

  render () {
    const { value, label, children, childClass } = this.props
    return (
      <div >
        <fieldset>
          <legend>{label}</legend>
          <div className='row'>
            {React.Children.map(children, child => {
              return React.cloneElement(child, {
                field: {
                  className: childClass,
                  value: value && value.includes(child.props.id),
                  onChange: this.handleChange,
                  onBlur: this.handleBlur
                }
              })
            })}
          </div>
        </fieldset>
      </div>
    )
  }
}

export default CheckboxGroup
