import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AssetAuditPage from '../../../features/asset-audit/viewAssetAudit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <AssetAuditPage />
    )
}

export default InternalPage