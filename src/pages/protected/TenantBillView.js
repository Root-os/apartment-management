import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ViewBillPayment from '../../features/tenant-bill-payment/viewTenantBills'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Get Tenant Payment"}))
      }, [])


    return(
        <ViewBillPayment />
    )
}

export default InternalPage