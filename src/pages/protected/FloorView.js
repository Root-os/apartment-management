import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import FloorManagement from '../../features/floor/viewFloor'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Floors"}))
      }, [])


    return(
        <FloorManagement />
    )
}

export default InternalPage