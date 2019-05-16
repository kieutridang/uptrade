import React from 'react'
const gql = require('graphql-tag')
const { Mutation } = require('react-apollo')

const UploadFile = ({ required, onUploadComplete }) => (
  <Mutation
    mutation={gql`
      mutation($file: Upload!) {
        singleUpload(file: $file) {
          id
          path
          filename
          mimetype
          encoding
        }
      }
    `}
  >
    {mutate => (
      <input
        type='file'
        required={required}
        onChange={
          ({
            target: {
              validity,
              files: [file]
            }
          }) => {
            if (validity.valid) {
              mutate({ variables: { file } }).then(({ data }) => {
                const { singleUpload } = data
                if (onUploadComplete) {
                  onUploadComplete(singleUpload)
                } else {
                  console.error('Please pass onUploadComplete props to FileUpload component')
                }
              }).catch(err => {
                console.error(err)
              })
            }
          }
        }
      />
    )}
  </Mutation>
)

export default UploadFile
