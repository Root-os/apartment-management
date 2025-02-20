import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddBillPayment from '../../features/tenant-bill-payment/addTenantBillPayment'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Add Tenant"}))
      }, [])


    return(
        <AddBillPayment />
    )
}

export default InternalPage