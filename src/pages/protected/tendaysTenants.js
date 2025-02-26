import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TenDaysTenant from '../../features/tenant/tendaysTenants'

function TenDays(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Ten Days Tenant List"}))
      }, [])


    return(
        <TenDaysTenant />
    )
}

export default TenDays