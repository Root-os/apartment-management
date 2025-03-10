import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import SendLetter from '../../../features/letter/sendLetter'

function AllLetter(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "" }))
      }, [])


    return(
        <SendLetter />
    )
}

export default AllLetter;