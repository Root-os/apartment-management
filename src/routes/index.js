// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))

const FloorAdd = lazy(() => import('../pages/protected/FloorAdd'))
const FloorView = lazy(() => import('../pages/protected/FloorView'))

const UnitAdd = lazy(() => import('../pages/protected/UnitAdd'))
const UnitView = lazy(() => import('../pages/protected/UnitView'))

const BillPaymentView = lazy(() => import('../pages/protected/BillPaymentView'))
const BillPaymentAdd = lazy(() => import('../pages/protected/BillPaymentAdd'))

const GovBillPaymentPage = lazy(() => import('../pages/protected/GovPaymentView'))
const GovBillPaymentAdd = lazy(() => import('../pages/protected/GovPaymentAdd'))

const ExpenseAdd = lazy(() => import('../pages/protected/ExpenseAdd'))
const ExpenseView = lazy(() => import('../pages/protected/ExpenseView'))

const ExpenseTypeAdd = lazy(() => import('../pages/protected/ExpenseTypeAdd'))
const ExpenseTypeView = lazy(() => import('../pages/protected/ExpenseTypeView'))

const TenantAdd = lazy(() => import('../pages/protected/TenantAdd'))
const TenantView = lazy(() => import('../pages/protected/TenantView'))

const TenantBillAdd = lazy(() => import('../pages/protected/TenantBillAdd'))
const TenantBillView = lazy(() => import('../pages/protected/TenantBillView'))

const RentAdd = lazy(() => import('../pages/protected/RentAdd'))
const RentView = lazy(() => import('../pages/protected/RentView'))

const ParkingAdd = lazy(() => import('../pages/protected/ParkingAdd'))
const ParkingView = lazy(() => import('../pages/protected/ParkingView'))
 //inventory
const ItemTypeAdd = lazy(() => import('../pages/protected/ItemTypeAdd'))
const ItemTypeView = lazy(() => import('../pages/protected/ItemTypeView'))
const ItemAdd = lazy(() => import('../pages/protected/ItemAdd'))
const ItemView = lazy(() => import('../pages/protected/ItemView'))

const PaymentRequestAdd = lazy(() => import('../pages/protected/PaymentRequestAdd'))
const PaymentRequestView = lazy(() => import('../pages/protected/PaymentRequestView'))


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
    path: '/expense-type-add', 
    component: ExpenseTypeAdd, 
  },
  {
    path: '/expense-type-view', 
    component: ExpenseTypeView, 
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
    path: '/tenant-bill-view', 
    component: TenantBillAdd, 
  },
  {
    path: '/tenant-bill-add', 
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
  {
    path: '/item-type-add', 
    component: ItemTypeAdd, 
  },
  {
    path: '/item-type-view', 
    component: ItemTypeView, 
  },
  {
    path: '/item-add', 
    component: ItemAdd, 
  },
  {
    path: '/item-view', 
    component: ItemView, 
  },
  {
    path: '/payment-request-add', 
    component: PaymentRequestAdd, 
  },
  {
    path: '/payment-request-view', 
    component: PaymentRequestView, 
  }
]

export default routes
