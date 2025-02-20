import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import GovBillPaymentPage from '../../features/payment-for-goverment/viewPayment'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Bill Type Lists"}))
      }, [])


    return(
        <GovBillPaymentPage />
    )
}

export default InternalPage