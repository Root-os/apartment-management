import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AddPermissionPage from '../../../features/permisssion/createPermission'

function ReturnReports(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <AddPermissionPage />
    )
}

export default ReturnReports