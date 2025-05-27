import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import LetterResponseView from '../../../features/letter-response/letterResponses'

function AllLetterSent(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <LetterResponseView />
    )
}

export default AllLetterSent