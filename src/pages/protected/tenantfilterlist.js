import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TenantFilterList from '../../features/tenant/filterTenant'

function TenantFilter(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Tenant Filter List by Units And Floor"}))
      }, [])


    return(
        <TenantFilterList />
    )
}

export default TenantFilter