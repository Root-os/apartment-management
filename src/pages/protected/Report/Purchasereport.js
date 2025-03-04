import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import PurchaseReport from '../../../features/report/purchaseReport'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Purchase report"}))
      }, [])


    return(
        <PurchaseReport />
    )
}

export default InternalPage