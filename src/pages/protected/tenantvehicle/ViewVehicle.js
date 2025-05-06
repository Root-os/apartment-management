import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TenantVehicles from '../../../features/tenant/tenant-vehicle/viewVehicle'

function AllUserList(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <TenantVehicles />
    )
}

export default AllUserList