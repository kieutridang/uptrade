import React from 'react'
import { Prompt } from 'react-router'

const PromptComponent = ({ open, message }) => {
  return (
    <Prompt
      when={open}
      message={message}
    />
  )
}

export default PromptComponent
