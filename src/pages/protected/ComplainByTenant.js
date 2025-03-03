import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddComplaint from '../../features/complaint-tenant-side/addComplaint'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Complaint"}))
      }, [])


    return(
        <AddComplaint />
    )
}

export default InternalPage