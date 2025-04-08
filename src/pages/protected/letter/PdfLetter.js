import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import LetterDetailPage from '../../../features/letter/letterPdfGenerator'

function AllLetterTypes(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <LetterDetailPage />
    )
}

export default AllLetterTypes