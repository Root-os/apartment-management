import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import EmployeeComplaints from '../../../features/complaint-admin-side/AssignedStaff/assignedComplain'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <EmployeeComplaints />
    )
}

export default InternalPage