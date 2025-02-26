import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import ExpenseReport from '../../../features/report/ExpenseReport'

function AllExpenseReport(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Expense  Report"}))
      }, [])


    return(
        <ExpenseReport />
    )
}

export default AllExpenseReport