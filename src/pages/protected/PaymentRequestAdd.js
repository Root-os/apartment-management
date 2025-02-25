import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddPaymentRequest from '../../features/payment-request/addPaymentRequest'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Payment Request"}))
      }, [])


    return(
        <AddPaymentRequest />
    )
}

export default InternalPage