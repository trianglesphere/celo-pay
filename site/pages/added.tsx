import { NextPage } from 'next'
import Layout from '../components/Layout'
import AddedComponent from '../components/AddedComponent'


const AddedPage: NextPage = () => {
  return (
    <Layout homeHeader="Seal-Labs Merchant Portal Home">
    <div className="page-container">
      < AddedComponent />
    </div>
  </Layout>
  )
}

export default AddedPage