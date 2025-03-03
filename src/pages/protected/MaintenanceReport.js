import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import MaintenanceReport from '../../features/report/maintenanceReport'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Maintenance"}))
      }, [])


    return(
        <MaintenanceReport />
    )
}

export default InternalPage