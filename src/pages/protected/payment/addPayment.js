import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import PaymentAdd from '../../../features/payment/addPayment'

function AddPayments(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Add Payment Details "}))
      }, [])


    return(
        <PaymentAdd />
    )
}

export default AddPayments