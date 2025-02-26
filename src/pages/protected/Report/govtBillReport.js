import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import GovtBillReport from '../../../features/report/govtBillReport'

function GovtReport(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Government Bill Report"}))
      }, [])


    return(
        <GovtBillReport />
    )
}

export default GovtReport