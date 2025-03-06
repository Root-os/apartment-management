import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import SalaryPaymentForm from '../../../features/Employee-Salary/addSinglePayment'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Employee Salary"}))
      }, [])


    return(
        <SalaryPaymentForm />
    )
}

export default InternalPage