import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import PurchaseRequestForm from '../../features/purchase-request/addPuchaseRequest'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Purchase"}))
      }, [])


    return(
        <PurchaseRequestForm />
    )
}

export default InternalPage