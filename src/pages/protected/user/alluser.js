import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import UserAll from '../../../features/user/getallUser'

function AllUserList(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "All User List"}))
      }, [])


    return(
        <UserAll />
    )
}

export default AllUserList