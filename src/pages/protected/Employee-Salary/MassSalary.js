import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import MassSalaryPayment from '../../../features/Employee-Salary/addMassPayment'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Employee Salary"}))
      }, [])


    return(
        <MassSalaryPayment />
    )
}

export default InternalPage