import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import ReturnReport from '../../../features/report/returnReport'

function ReturnReports(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Return Report"}))
      }, [])


    return(
        <ReturnReport />
    )
}

export default ReturnReports