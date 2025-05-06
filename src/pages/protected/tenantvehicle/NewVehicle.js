import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AddVehicleForm from '../../../features/tenant/tenant-vehicle/addVehicle'

function AllUserList(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <AddVehicleForm />
    )
}

export default AllUserList