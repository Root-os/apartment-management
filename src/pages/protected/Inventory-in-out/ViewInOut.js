import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TenantInventoryPage from '../../../features/tenant-in-out/viewInventoryIn'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Inventory In Out"}))
      }, [])


    return(
        <TenantInventoryPage />
    )
}

export default InternalPage