import { NextPage } from 'next'
import Layout from '../components/Layout'
import MerchantForm from '../components/MerchantForm'


const IndexPage: NextPage = () => {
  return (
    <Layout homeHeader="Seal-Labs Merchant Portal">
    <div className="page-container">
      <h1 style={{width:'24ch'}} >Add Merchant </h1>
      <MerchantForm />
    </div>
  </Layout>
  )
}

export default IndexPage