import React, { ReactNode } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { merchant_url, api_key } from '../config/config'

type Props = {}

type FormField = string
type FormState = Record<FormField, any>
export function postForm(route: string, formData: FormState) {
  return fetch(route, {
    method: 'POST',
    headers: {
      'Access-Control-Request-Headers': 'Content-Type',
      // "Access-Control-Allow-Headers": "Content-Type",
      // "Access-Control-Allow-Origin": "*",
      "Access-Control-Request-Methods": "POST",

      'Content-Type': 'application/json',
      'X-API-KEY': api_key,
    },
    body: JSON.stringify(formData),
  })
}

// This is only a basic validation
function validateAddress(address: string) {
  // return /^(0x)?[0-9a-f]{40}$/i.test(address)
  // return /^(0x)[0-9a-f]{40}$/i.test(address)
  return true
}

interface State {
  address: string
  name: string
}

class MerchantForm extends React.Component<Props, State> {
  state: State = {
    address: '',
    name: '',
  }

  handleName = ({ currentTarget }: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = currentTarget
    this.setState({ name: value });
  }

  handleAddress = ({ currentTarget }: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = currentTarget
    this.setState({ address: value });
  }

  handleSubmit = async (event: any) => {
    if (!validateAddress(this.state.address)) {
      alert(this.state.address + ' is not a valid address')
    }
    event.preventDefault()
    let res
    try {
      res = await postForm(merchant_url, { "address": this.state.address, "name": this.state.name })
      console.info(res)
      // TODO: Change the window to this url to display the id & api key for the merchant_url
      // window.location.href = `./added?id=${id}&api_key=${api_key}`;
    } catch (e) {
      console.info('Error posting form ' + e)
      console.info(e)
    }
    // const id = "10"
    // const api_key = "fdjsaklf"
    // window.location.href = `./added?id=${id}&api_key=${api_key}`;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="FormInput">
        <label>
          Merchant Name
          <input type="text" value={this.state.name} onChange={this.handleName} />
        </label>
        <label>
          Address
          <input type="text" value={this.state.address} onChange={this.handleAddress} placeholder="0x0000 1111 2222 3333 4444" />
        </label>
        <button type="submit" className="cart-style-background" disabled={!validateAddress(this.state.address) || this.state.name === ''}>
          Submit
        </button>
      </form>
    );
  }
}


export default MerchantForm
