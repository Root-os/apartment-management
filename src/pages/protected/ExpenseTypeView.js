import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ExpensePage from '../../features/expense-type/viewExpenseType'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Expense Type"}))
      }, [])


    return(
        <ExpensePage />
    )
}

export default InternalPage