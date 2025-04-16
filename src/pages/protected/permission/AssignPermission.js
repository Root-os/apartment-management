import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AssignPermissionsPage from '../../../features/permisssion/assignPermission'

function ReturnReports(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <AssignPermissionsPage />
    )
}

export default ReturnReports