import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AllPaymentsPage from '../../../features/payment/allPayment'

function AllPayments(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "All Payment List "}))
      }, [])


    return(
        <AllPaymentsPage />
    )
}

export default AllPayments