import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import ViewNotification from '../../../features/notfication/viewNotfication'

function AllNotfi(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <ViewNotification />
    )
}

export default AllNotfi