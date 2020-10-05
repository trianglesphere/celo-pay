import { NextPage } from 'next'
import Layout from '../components/Layout'
import MerchantUpdateForm from '../components/MerchantUpdateForm'



const UpdatePage: NextPage = () => {
  return (
    <Layout homeHeader="Seal-Labs Merchant Portal Home">
    <div className="page-container">
      <h1 style={{width:'24ch'}} >Add Merchant </h1>
      < MerchantUpdateForm />
    </div>
  </Layout>
  )
}

export default UpdatePage