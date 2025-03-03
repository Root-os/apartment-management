import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AddVendor from '../../../features/vendor/addVendor'

function AddVendors(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Add Service Type"}))
      }, [])


    return(
        <AddVendor />
    )
}

export default AddVendors