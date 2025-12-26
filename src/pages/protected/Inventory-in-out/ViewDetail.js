import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TenantInventoryDetailPage from '../../../features/tenant-in-out/inventoryDetail'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <TenantInventoryDetailPage />
    )
}

export default InternalPage