import { NextPage } from 'next'
import Layout from '../components/Layout'
import MerchantForm from '../components/MerchantForm'
import MerchantUpdateForm from '../components/MerchantUpdateForm'



const IndexPage: NextPage = () => {
  return (
      <Layout>
        <div className="page-container">
          <h1> Seal Labs Merchant Portal </h1>
          <h2><a href="./add">Create New Merchant </a></h2>
          <h2><a href="./update">Update Merchant Address</a></h2>
        </div>
      </Layout>
  )
}

export default IndexPage