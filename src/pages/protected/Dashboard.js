import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Dashboard from '../../features/dashboard/index'
import TenantDashboard from '../../features/dashboard/Tenant'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])
const role = localStorage.getItem('role');


    return(
       role==='tenant'?<TenantDashboard />: <Dashboard />
    )
}

export default InternalPage