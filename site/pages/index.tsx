import { NextPage } from 'next'
import Layout from '../components/Layout'
import MerchantForm from '../components/MerchantForm'
import MerchantUpdateForm from '../components/MerchantUpdateForm'



const IndexPage: NextPage = () => {
  return (
    <Layout homeHeader="Seal-Labs Merchant Portal">
    <div className="page-container">
      <h1 style={{width:'24ch'}} >Add Merchant </h1>
      <MerchantForm />
      <MerchantUpdateForm />
    </div>
  </Layout>
  )
}

export default IndexPage