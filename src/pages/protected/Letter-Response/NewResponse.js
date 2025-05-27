import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import RespondToLetter from '../../../features/letter-response/newLetterResponse'

function AllLetterSent(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <RespondToLetter />
    )
}

export default AllLetterSent