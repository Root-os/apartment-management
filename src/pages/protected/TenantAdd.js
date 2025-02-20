import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddTenant from '../../features/tenant/addTenant'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Add Tenant"}))
      }, [])


    return(
        <AddTenant />
    )
}

export default InternalPage