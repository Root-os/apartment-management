import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TenantComplaintsPage from '../../features/complaint-tenant-side/viewMyComplain'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Complaints"}))
      }, [])


    return(
        <TenantComplaintsPage />
    )
}

export default InternalPage