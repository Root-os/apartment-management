import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TenantRentPage from '../../../features/rent-collection/tenant-view'

function AllExpenseReport(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <TenantRentPage />
    )
}

export default AllExpenseReport