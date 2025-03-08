import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ItemTypesPage from '../../features/inventory/item-type/viewItemType'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "  "}))
      }, [])


    return(
        <ItemTypesPage />
    )
}

export default InternalPage