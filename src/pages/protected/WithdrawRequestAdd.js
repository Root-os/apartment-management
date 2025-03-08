import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import WithdrawalRequestForm from '../../features/withdraw-request/tenant/addWithdrawRequest'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <WithdrawalRequestForm />
    )
}

export default InternalPage