import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddGovBillPayment from '../../features/payment-for-goverment/addPayment'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Add Payment for Goverment"}))
      }, [])


    return(
        <AddGovBillPayment />
    )
}

export default InternalPage