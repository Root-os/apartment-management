import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ChargingPage from '../../features/charging/viewCharging'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Charging"}))
      }, [])


    return(
        <ChargingPage />
    )
}

export default InternalPage