import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddExpense from '../../features/expense/addExpense'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Add Expense"}))
      }, [])


    return(
        <AddExpense />
    )
}

export default InternalPage