import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AddReturn from '../../../features/return/addReturn'

function Addreturns(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Add Return Details "}))
      }, [])


    return(
        <AddReturn />
    )
}

export default Addreturns