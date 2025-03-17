import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AddAsset from '../../../features/asset/addAsset'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <AddAsset />
    )
}

export default InternalPage