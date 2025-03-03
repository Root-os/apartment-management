import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddCollectedRent from '../../features/rent-collection/addRent'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Rent"}))
      }, [])


    return(
        <AddCollectedRent />
    )
}

export default InternalPage