import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import PaymentTypeForm from '../../../features/payment-type/addPaymentType'

function AddPayments(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : " "}))
      }, [])


    return(
        <PaymentTypeForm />
    )
}

export default AddPayments