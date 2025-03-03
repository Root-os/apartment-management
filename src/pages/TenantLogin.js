import {useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import TenantLoginPage from '../features/tenant-profile/tenantLogin'

function ExternalPage(){


    return(
        <div className="">
                <TenantLoginPage />
        </div>
    )
}

export default ExternalPage