import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import MyTenantItems from '../../../features/tenant-in-out/tenant-side/seeMyItems'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <MyTenantItems/>
    )
}

export default InternalPage