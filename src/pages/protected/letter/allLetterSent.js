import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AllSendLetterPage from '../../../features/letter/allSentLetters'

function AllLetterSent(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "All Letter Types"}))
      }, [])


    return(
        <AllSendLetterPage />
    )
}

export default AllLetterSent