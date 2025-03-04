import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import StockOutRequestPage from '../../features/stock-out/admin/viewAllStocks'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Stocks"}))
      }, [])


    return(
        <StockOutRequestPage />
    )
}

export default InternalPage