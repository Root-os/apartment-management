import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddNotificationType from '../../features/notification-type/addNotificationType'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Notfication"}))
      }, [])


    return(
        <AddNotificationType />
    )
}

export default InternalPage