import React from 'react'
import Select from 'react-select'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import NoSsr from '@material-ui/core/NoSsr'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  input: {
    display: 'flex',
    padding: 0
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  }
})

function NoOptionsMessage (props) {
  return (
    <Typography
      color='textSecondary'
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function inputComponent ({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />
}

function Control (props) {
  return (
    <TextField
      fullWidth
      style={{
        height: 48,
        margin: '10px 0'
      }}
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  )
}

function Option (props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component='div'
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  )
}

function Placeholder (props) {
  return (
    <Typography
      color='textSecondary'
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function SingleValue (props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function ValueContainer (props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  )
}

function Menu (props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  )
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
}

const selectStyles = {
  input: base => ({
    ...base,
    '& input': {
      font: 'inherit'
    }
  })
}

class InputSelect extends React.Component {
  handleChange = (value) => {
    const { onChange } = this.props
    onChange(value)
  }

  render () {
    const {
      value, label, suggestions,
      placeholder, classes, handleInputChange,
      isLoading, isDisabled, minSearchLength,
      getOptionLabel, getOptionValue,
      innerRef
    } = this.props

    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label: label,
              InputLabelProps: {
                shrink: true
              }
            }}
            options={suggestions || []}
            components={components}
            value={value}
            onChange={this.handleChange}
            placeholder={placeholder}
            onInputChange={handleInputChange}
            noOptionsMessage={({ inputValue }) => {
              if (minSearchLength) {
                if (inputValue.length < minSearchLength) {
                  return `Input at least ${minSearchLength} characters`
                }
              }
              return 'No option found'
            }}
            isLoading={isLoading}
            isDisabled={isDisabled}
            loadingMessage={() => 'Loading'}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            escapeClearsValue
            ref={innerRef}
          />
        </NoSsr>
      </div>
    )
  }
}

export default withStyles(styles)(InputSelect)
