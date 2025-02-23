import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ParkingList from '../../features/parking/viewParking'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Parking"}))
      }, [])


    return(
        <ParkingList />
    )
}

export default InternalPage