import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TenantLettersPage from '../../../features/letter/tenant-side/viewMyLetters'

function AllLetterSent(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <TenantLettersPage />
    )
}

export default AllLetterSent