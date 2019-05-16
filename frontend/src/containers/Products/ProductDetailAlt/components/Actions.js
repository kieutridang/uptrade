import React from 'react'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const Actions = () => (
  <article className='article products closebox' style={{ marginTop: '-20px' }}>
    <div className='row article-notitle'>
      <div className='col-sm-12'>
        <div className='box box-default'>
          <div className='box-header'>
          Actions</div>
          <div className='box-body'>
            <div className='container'>
              <div className='row'>
                <div className='col-sm-3 '>
                  <div className='row'>
                    <FormControlLabel
                      control={
                        <Switch
                          value=''
                          checked
                        />
                      }
                      label='Shortlist'
                    />
                  </div>
                  <div className='row'>
                    <p className='small'>Shortlisted on 26/11/2018</p>
                  </div>
                </div>
                <div className='col-sm-3 '>
                  <FormControlLabel
                    control={
                      <Switch
                        value=''
                        unchecked
                      />
                    }
                    label='Request More Details'
                  />
                </div>
                <div className='col-sm-3 '>
                  <FormControlLabel
                    control={
                      <Switch
                        value=''
                        unchecked
                      />
                    }
                    label='Request Official Quote'
                  />
                </div>
                <div className='col-sm-3 '>
                  <div className='row'>
                    <FormControlLabel
                      control={
                        <Switch
                          value=''
                          checked
                        />
                      }
                      label='Request Sample'
                    />
                  </div>
                  <div className='row'>
                    <p className='small'>Requested on 26/11/2018</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
)

export default Actions
