import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import RentCollectionPage from '../../features/rent-collection/viewRent'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Rent"}))
      }, [])


    return(
        <RentCollectionPage />
    )
}

export default InternalPage