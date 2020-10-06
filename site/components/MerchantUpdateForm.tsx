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
  id: string
}

class MerchantUpdateForm extends React.PureComponent<Props, State> {
  state: State = {
    address: '',
    id: '',
  }

  handleId = ({ currentTarget }: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = currentTarget
    this.setState({ id: value });
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
    let res: Response
    try {
      res = await postForm(merchant_url + '/' + this.state.id, { "address": this.state.address })
      console.info(res)
      const json = await res.json()
      console.info(json)
      if (json['success']) {
        alert("Merchant address updated.")
      } else {
        alert("Failed to updte merchant address.")
      }
    } catch (e) {
      alert('Error in updating merchant address. error:' + e)
      console.info(e)
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="FormInput">
        <label>
          Merchant Id
          <input type="text" value={this.state.id} onChange={this.handleId} />
        </label>
        <label>
          New Address
          <input type="text" value={this.state.address} onChange={this.handleAddress} placeholder="0x0000 1111 2222 3333 4444" />
        </label>
        <button type="submit" className="cart-style-background" disabled={!validateAddress(this.state.address) || this.state.id === ''}>
          Update Address
        </button>
      </form>
    );
  }
}


export default MerchantUpdateForm
