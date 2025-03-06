import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import SalaryPayments from '../../../features/Employee-Salary/viewAllHistory'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Employee Salary"}))
      }, [])


    return(
        <SalaryPayments />
    )
}

export default InternalPage