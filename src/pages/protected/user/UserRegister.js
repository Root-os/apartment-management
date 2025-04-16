import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import RegisterUserPage from '../../../features/user/registerUser'

function AllUserList(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <RegisterUserPage />
    )
}

export default AllUserList