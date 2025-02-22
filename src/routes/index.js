// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))


//floor
const FloorAdd = lazy(() => import('../pages/protected/FloorAdd'))
const FloorView = lazy(() => import('../pages/protected/FloorView'))

//unit
const UnitAdd = lazy(() => import('../pages/protected/UnitAdd'))
const UnitView = lazy(() => import('../pages/protected/UnitView'))


const BillPaymentView = lazy(() => import('../pages/protected/BillPaymentView'))
const BillPaymentAdd = lazy(() => import('../pages/protected/BillPaymentAdd'))
const GovBillPaymentPage = lazy(() => import('../pages/protected/GovPaymentView'))
const GovBillPaymentAdd = lazy(() => import('../pages/protected/GovPaymentAdd'))
const ExpenseAdd = lazy(() => import('../pages/protected/ExpenseAdd'))
const ExpenseView = lazy(() => import('../pages/protected/ExpenseView'))

//tenant
const TenantAdd = lazy(() => import('../pages/protected/TenantAdd'))
const TenantView = lazy(() => import('../pages/protected/TenantView'))
const TenDays = lazy(() => import('../pages/protected/tendaysTenants'))
const TenantFilter = lazy(() => import('../pages/protected/tenantfilterlist'))





const TenantBillAdd = lazy(() => import('../pages/protected/TenantBillAdd'))
const TenantBillView = lazy(() => import('../pages/protected/TenantBillView'))
const RentAdd = lazy(() => import('../pages/protected/RentAdd'))
const RentView = lazy(() => import('../pages/protected/RentView'))
const ParkingAdd = lazy(() => import('../pages/protected/ParkingAdd'))
const ParkingView = lazy(() => import('../pages/protected/ParkingView'))

//Report
const TenantReportPage = lazy(() => import('../pages/protected/Report/tenantBillReport'))
const TenantReportPageTwo = lazy(() => import('../pages/protected/Report/tenantReport'))
const GovtReport = lazy(() => import('../pages/protected/Report/govtBillReport'))








const routes = [
  {
    path: '/', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
  },
  {
    path: '/settings-billing',
    component: Bills,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },


  {
    path: '/floor-add', 
    component: FloorAdd, 
  },
  {
    path: '/floor-view', 
    component: FloorView, 
  },
  {
    path: '/unit-add', 
    component: UnitAdd, 
  },
  {
    path: '/unit-view', 
    component: UnitView, 
  },
  {
    path: '/bill-type-add', 
    component: BillPaymentAdd, 
  },
  {
    path: '/bill-type-view', 
    component: BillPaymentView, 
  },
  {
    path: '/payment-goverment-view', 
    component: GovBillPaymentPage, 
  },
  {
    path: '/payment-goverment-add', 
    component: GovBillPaymentAdd, 
  },
  {
    path: '/expense-add', 
    component: ExpenseAdd, 
  },
  {
    path: '/expense-view', 
    component: ExpenseView, 
  },
  {
    path: '/tenant-add', 
    component: TenantAdd, 
  },
  {
    path: '/tenant-view', 
    component: TenantView, 
  },
  {
    path: '/ten-days-tenant', 
    component: TenDays, 
  },
  {
    path: '/tenant-filter', 
    component: TenantFilter, 
  },
  
  


  {
    path: '/tenant-bill-add', 
    component: TenantBillAdd, 
  },
  {
    path: '/tenant-bill-view', 
    component: TenantBillView, 
  },
  {
    path: '/rent-collection-add', 
    component: RentAdd, 
  },
  {
    path: '/rent-collection-view', 
    component: RentView, 
  },
  {
    path: '/parking-add', 
    component: ParkingAdd, 
  },
  {
    path: '/parking-view', 
    component: ParkingView, 
  },

  //report

  {
    path: '/tenantBill-report', 
    component: TenantReportPage, 
  },
  {
    path: '/tenant-report', 
    component: TenantReportPageTwo, 
  },
  {
    path: '/govt-report', 
    component: GovtReport, 
  }

]

export default routes
