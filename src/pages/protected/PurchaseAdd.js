import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddPurchaseForm from '../../features/purchase/addPurchase'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Purchase"}))
      }, [])


    return(
        <AddPurchaseForm />
    )
}

export default InternalPage