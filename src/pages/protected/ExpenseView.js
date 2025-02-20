import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ExpensePage from '../../features/expense/viewExpense'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Expenses"}))
      }, [])


    return(
        <ExpensePage />
    )
}

export default InternalPage