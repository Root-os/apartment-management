import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import VendorsPage from '../../../features/vendor/allVendor'

function AllVendors(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "All Vendor List "}))
      }, [])


    return(
        <VendorsPage />
    )
}

export default AllVendors