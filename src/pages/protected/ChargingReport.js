import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ChargingReport from '../../features/report/chargingReport'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Charging Report"}))
      }, [])


    return(
        <ChargingReport />
    )
}

export default InternalPage