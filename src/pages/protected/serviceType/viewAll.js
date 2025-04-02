import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import ServiceTypesPage from '../../../features/serviceType/serviceTypeView'

function AllServices(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <ServiceTypesPage />
    )
}

export default AllServices