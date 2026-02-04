import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import GalleryPage from '../../../features/setting/gallery';
import { setPageTitle } from '../../../features/common/headerSlice'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <GalleryPage />
    )
}

export default InternalPage