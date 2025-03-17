import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AddAssetAudit from '../../../features/asset-audit/addAssetAudit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <AddAssetAudit />
    )
}

export default InternalPage