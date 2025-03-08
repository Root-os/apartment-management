import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import PaymentRequestsPage from '../../features/payment-request/viewPaymentRequest'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <PaymentRequestsPage />
    )
}

export default InternalPage