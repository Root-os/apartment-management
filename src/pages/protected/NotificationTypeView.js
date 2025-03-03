import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import NotificationPage from '../../features/notification-type/viewNotificationType'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Notfication"}))
      }, [])


    return(
        <NotificationPage />
    )
}

export default InternalPage