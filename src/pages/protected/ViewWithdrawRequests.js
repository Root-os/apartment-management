import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import WithdrawalRequests from '../../features/withdraw-request/admin/viewRequests'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Withdrawal Requests"}))
      }, [])


    return(
        <WithdrawalRequests />
    )
}

export default InternalPage