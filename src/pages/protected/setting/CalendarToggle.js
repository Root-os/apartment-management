import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import CalendarToggle from '../../../features/setting/calendarTogge'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <CalendarToggle />
    )
}

export default InternalPage