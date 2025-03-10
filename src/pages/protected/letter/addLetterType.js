import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AddLetterType from '../../../features/letter/letterAdd'

function AddLetterTypes(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : ""}))
      }, [])


    return(
        <AddLetterType />
    )
}

export default AddLetterTypes