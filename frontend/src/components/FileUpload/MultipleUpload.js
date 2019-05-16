import React from 'react'
const gql = require('graphql-tag')
const { Mutation } = require('react-apollo')

const UploadFile = ({ required, onUploadComplete }) => (
  <Mutation
    mutation={gql`
      mutation($files: [Upload!]!) {
        multipleUpload(files: $files) {
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
        multiple
        onChange={
          ({
            target: {
              validity,
              files
            }
          }) => {
            if (validity.valid) {
              const fileArray = []
              for (var i = 0; i < files.length; i++) {
                fileArray.push(files.item(i))
              }
              if (fileArray.length > 0) {
                mutate({ variables: { files: fileArray } }).then(({ data }) => {
                  const { multipleUpload } = data
                  if (onUploadComplete) {
                    onUploadComplete(multipleUpload)
                  } else {
                    console.error('Please pass onUploadComplete props to FileUpload component')
                  }
                }).catch(err => {
                  console.error(err)
                })
              }
            }
          }
        }
      />
    )}
  </Mutation>
)

export default UploadFile
