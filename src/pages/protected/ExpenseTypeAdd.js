import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddExpense from '../../features/expense-type/addExpenseType'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Expense Type"}))
      }, [])


    return(
        <AddExpense />
    )
}

export default InternalPage