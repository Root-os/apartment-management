import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TenantOrderPage from '../../../features/order/tenantOrderPage'

function TenantOrderType(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <TenantOrderPage />
    )
}

export default TenantOrderType