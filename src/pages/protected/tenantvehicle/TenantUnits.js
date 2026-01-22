import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TenantUnits from '../../../features/tenant-profile/tenantUnits'

function AllUnitList(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])

    return(
        <TenantUnits />
    )
}

export default AllUnitList