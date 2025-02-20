import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import BillTablePage from '../../features/bill-type/addBillPayment'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Bill Type Lists"}))
      }, [])


    return(
        <BillTablePage />
    )
}

export default InternalPage