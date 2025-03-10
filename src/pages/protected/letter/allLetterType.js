import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import LetterTypesPage from '../../../features/letter/viewLetterType'

function AllLetterTypes(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "All Letter Types"}))
      }, [])


    return(
        <LetterTypesPage />
    )
}

export default AllLetterTypes