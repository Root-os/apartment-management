import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TenantBillReport from '../../../features/report/tenatBillReport'

function TenantReportPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Tenant Bill Report"}))
      }, [])


    return(
        <TenantBillReport />
    )
}

export default TenantReportPage