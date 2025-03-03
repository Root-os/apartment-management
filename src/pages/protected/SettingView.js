import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import CurrencySettingsPage from '../../features/setting/viewSettings'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " Settings"}))
      }, [])


    return(
        <CurrencySettingsPage />
    )
}

export default InternalPage