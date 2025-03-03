import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddParking from '../../features/parking/addParking'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Parking"}))
      }, [])


    return(
        <AddParking />
    )
}

export default InternalPage