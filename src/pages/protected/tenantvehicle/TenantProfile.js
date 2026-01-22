import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TenantProfile from '../../../features/tenant-profile/tenantProfile'

function Profile(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])

    return(
        <TenantProfile />
    )
}

export default Profile