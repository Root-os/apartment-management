import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import OrderTypesPage from '../../../features/order/viewOrderType'

function OrderTypes(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <OrderTypesPage />
    )
}

export default OrderTypes