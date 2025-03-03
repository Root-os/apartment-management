import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddChargingData from '../../features/charging/addCharging'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Charging"}))
      }, [])


    return(
        <AddChargingData />
    )
}

export default InternalPage