import {useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import TenantPaymentVerificationPage from '../features/payment-request/requestTenantLink'

function ExternalPage(){


    return(
        <div className="">
                <TenantPaymentVerificationPage />
        </div>
    )
}

export default ExternalPage