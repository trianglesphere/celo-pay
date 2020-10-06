import { NextPage } from 'next'
import Layout from '../components/Layout'
import MerchantForm from '../components/MerchantForm'



const AddPage: NextPage = () => {
  return (
    <Layout homeHeader="Seal-Labs Merchant Portal Home">
    <div className="page-container">
      <h1 style={{width:'24ch'}} >Add Merchant </h1>
      <MerchantForm />
    </div>
  </Layout>
  )
}

export default AddPage