import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TenantReport from '../../../features/report/tenantReport'

function TenantReportPageTwo(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <TenantReport />
    )
}

export default TenantReportPageTwo