import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import BulkNotification from '../../../features/notfication/bulkNotfication'

function AddBulkNotfi(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <BulkNotification />
    )
}

export default AddBulkNotfi