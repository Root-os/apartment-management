import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import PurchasesRequestPage from '../../features/purchase-request/viewPurchaseRequst'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Purchase Requests"}))
      }, [])


    return(
        <PurchasesRequestPage />
    )
}

export default InternalPage