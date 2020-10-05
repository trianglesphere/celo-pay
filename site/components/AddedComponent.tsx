import React, { Component } from 'react'

import url from 'url'
import querystring from 'querystring'

type Props = {}

interface State {
  id: string
  api_key: string
}


interface State { }

class AddedComponent extends React.Component<Props, State> {
  state: State = {
    id: '',
    api_key: '',
  }

  componentDidMount() {
    let s = window.location.href.split("?")
    if (s.length === 2) {
      const params = querystring.parse(s[1])

      console.info(params)
      if (params['id']) {
        this.state.id = params['id']
      }
      if (params['api_key']) {
        console.info("set api key")
        this.state.api_key = params['api_key']
      }
    }
  }

  render() {
    return (
      <div>
        <h1>Added New User</h1>
        <h2>Merchant ID: {this.state.id}</h2>
        <h2>API Key: {this.state.api_key}</h2>
      </div>
    )
  }
}



export default AddedComponent  