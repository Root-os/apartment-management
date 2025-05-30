import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import NavigateAssetAudit from '../../../features/asset-audit/navigateToAudit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <NavigateAssetAudit />
    )
}

export default InternalPage