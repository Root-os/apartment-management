import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddItem from '../../features/inventory/items/addItems'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Item"}))
      }, [])


    return(
        <AddItem />
    )
}

export default InternalPage