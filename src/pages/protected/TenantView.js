import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TenantList from '../../features/tenant/viewTenant'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Tenant List"}))
      }, [])


    return(
        <TenantList />
    )
}

export default InternalPage