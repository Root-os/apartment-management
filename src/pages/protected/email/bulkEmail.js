import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import SendBulkEmail from '../../../features/email/sendBulkEmail'

function AddBulkEmail(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Send Bulk Email"}))
      }, [])


    return(
        <SendBulkEmail />
    )
}

export default AddBulkEmail