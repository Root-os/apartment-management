import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AddStockOutRequestPage from '../../../features/stock-out/employee/initialStockRequest'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Stocks"}))
      }, [])


    return(
        <AddStockOutRequestPage />
    )
}

export default InternalPage