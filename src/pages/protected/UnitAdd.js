import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddFloorUnit from '../../features/unit/addUnit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Unit"}))
      }, [])


    return(
        <AddFloorUnit />
    )
}

export default InternalPage