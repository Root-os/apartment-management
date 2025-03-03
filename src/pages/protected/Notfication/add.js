import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AddNotification from '../../../features/notfication/addNotfication'

function AddNotfi(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Send Single Notfication"}))
      }, [])


    return(
        <AddNotification />
    )
}

export default AddNotfi