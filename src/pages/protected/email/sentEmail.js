import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import SentEmail from '../../../features/email/sentEmail'

function SentEmailList(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Send Email List"}))
      }, [])


    return(
        <SentEmail />
    )
}

export default SentEmailList