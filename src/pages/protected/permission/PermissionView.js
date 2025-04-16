import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import PermissionsPage from '../../../features/permisssion/viewPermission'

function ReturnReports(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <PermissionsPage />
    )
}

export default ReturnReports