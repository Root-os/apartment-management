import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import PaymentTypesPage from '../../../features/payment-type/viewPaymentType'

function AddPayments(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <PaymentTypesPage />
    )
}

export default AddPayments