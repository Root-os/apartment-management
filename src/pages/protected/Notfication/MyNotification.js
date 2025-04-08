import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TenantNotificationPage from '../../../features/notfication/myNotification'

function AllNotfi(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <TenantNotificationPage />
    )
}

export default AllNotfi