import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import UnitManagement from '../../features/unit/viewUnit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Units"}))
      }, [])


    return(
        <UnitManagement />
    )
}

export default InternalPage