import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import MyOrdersPage from '../../../features/order/myOrderList'

function MyOrder(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <MyOrdersPage />
    )
}

export default MyOrder