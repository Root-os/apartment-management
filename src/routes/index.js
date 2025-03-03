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
const TenDays = lazy(() => import('../pages/protected/tendaysTenants'))
const TenantFilter = lazy(() => import('../pages/protected/tenantfilterlist'))

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

//Notfication
const notficationAdd=lazy(() => import('../pages/protected/Notfication/add'))
const allNotfication=lazy(() => import('../pages/protected/Notfication/viewAll'))
const bulkNotfication=lazy(() => import('../pages/protected/Notfication/bulkNotfi'))

//Email
const singleEmail=lazy(() => import('../pages/protected/email/addsingleEmail'))
const BulkEmail=lazy(() => import ('../pages/protected/email/bulkEmail'))
const sentEmails=lazy(() => import('../pages/protected/email/sentEmail'))

const NotificationTypeAdd = lazy(() => import('../pages/protected/NotificationTypeAdd'))
const NotificationTypeView = lazy(() => import('../pages/protected/NotificationTypeView'))

//User
const ALlUser=lazy(() => import ('../pages/protected/user/alluser'))

const ChargingAdd = lazy(() => import('../pages/protected/ChargingAdd'))
const ChargingView = lazy(() => import('../pages/protected/ChargingView'))

//Report
const GovtReport=lazy(() => import('../pages/protected/Report/govtBillReport'))
const TenantReportPage=lazy(() => import('../pages/protected/Report/tenantBillReport'))
const TenantReportPageTwo=lazy(() => import('../pages/protected/Report/tenantReport'))
const ExpenseReportPage=lazy(() => import('../pages/protected/Report/ExpenseReport'))   







const PurchaseReport=lazy(() => import('../pages/protected/Purchasereport'))
const ChargingReport=lazy(() => import('../pages/protected/ChargingReport'))
const MaintenanceReport=lazy(() => import('../pages/protected/MaintenanceReport'))

//complaint tenantside
const ComplainByTenant=lazy(() => import('../pages/protected/ComplainByTenant'))
const ComplainByTenantView=lazy(() => import('../pages/protected/ComplainByTenantView'))

//complaints admin side
const ComplainFromTenant=lazy(() => import('../pages/protected/ComplainFromTenant'))
const AssignedStaff=lazy(() => import('../pages/protected/AssignedStaff'))

//withdraw request tenant side
const WithdrawRequestAdd=lazy(() => import('../pages/protected/WithdrawRequestAdd'))
const MyWithdrawRequest=lazy(() => import('../pages/protected/MyWithdrawRequests'))
//withdraw request admin side
const ViewWithdrawRequests=lazy(() => import('../pages/protected/ViewWithdrawRequests'))

//setting
const SettingAdd =lazy(() => import('../pages/protected/SettingAdd'))  
const SettingView =lazy(() => import('../pages/protected/SettingView')) 

//purchase
const PurchaseAdd =lazy(() => import('../pages/protected/PurchaseAdd')) 
const PurchaseView =lazy(() => import('../pages/protected/PurchaseView')) 

//purchase request
const PurchaseRequestAdd =lazy(() => import('../pages/protected/PurchaseRequestAdd')) 
const PurchaseRequestView =lazy(() => import('../pages/protected/PurchaseRequestView')) 

//maintenance
const MaintenanceAdd =lazy(() => import('../pages/protected/MaintenanceAdd')) 
const MaintenanceView =lazy(() => import('../pages/protected/MaintenanceView'))

//item assignments
const ItemAssignmentAdd =lazy(() => import('../pages/protected/ItemAssignmentAdd'))
const ItemAssignmentView =lazy(() => import('../pages/protected/ItemAssignmentView'))

//service type
const ServiceTypeAdd =lazy(() => import('../pages/protected/serviceType/add'))
const ServiceTypeView =lazy(() => import('../pages/protected/serviceType/viewAll'))

const role = localStorage.getItem('role');

const routes =role==='tenant' ?
[
  {
    path: '/', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/complain-tenant-add', 
    component: ComplainByTenant, 
  },
  {
    path: '/complain-tenant-view', 
    component: ComplainByTenantView, 
  },
  {
    path: '/withdraw-request-add', 
    component: WithdrawRequestAdd, 
  },
  {
    path: '/withdraw-request-view', 
    component: MyWithdrawRequest, 
  },

 ]:

 //admin dashboard
[
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
    path: '/ten-days-tenant', 
    component: TenDays, 
  },
  {
    path: '/tenant-filter', 
    component: TenantFilter, 
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
  },
  {
    path: '/notfication-type-add', 
    component: NotificationTypeAdd, 
  },
  {
    path: '/notfication-type-view', 
    component: NotificationTypeView, 
  },
  {
    path: '/Charging-add', 
    component: ChargingAdd, 
  },
  {
    path: '/Charging-view', 
    component: ChargingView, 
  },

   //notfication
   {
    path: '/add-notfication', 
    component: notficationAdd, 
  },
  {
    path: '/Send-bulk-notfication', 
    component: bulkNotfication, 
  },
  {
    path: '/all-notfication', 
    component: allNotfication, 
  },

  //email
  {
    path: '/send-single-email', 
    component: singleEmail, 
  },
  {
    path: '/send-bulk-email', 
    component: BulkEmail, 
  },
  {
    path: '/send-emails', 
    component: sentEmails, 
  },

  {
    path: '/All-User', 
    component: ALlUser, 
  },
  //Report
  {
    path: '/govt-bill-report', 
    component: GovtReport, 
  },
  {
    path: '/tenant-bill-report', 
    component: TenantReportPage, 
  },
  {
    path: '/tenant-report', 
    component: TenantReportPageTwo, 
  },
  {
    path: '/expense-report', 
    component: ExpenseReportPage, 
  },
  
  

  
{
    path: '/purchase-report', 
    component: PurchaseReport, 
  },
  {
    path: '/charging-report', 
    component: ChargingReport, 
  },
  {
    path: '/maintenance-report', 
    component: MaintenanceReport, 
  },
//complaint

{
  path: '/complain-fromT-view', 
  component: ComplainFromTenant, 
},
{
  path: '/admin-view-assigneds', 
  component: AssignedStaff, 
},
{
  path: '/view-withdraw-requests', 
  component: ViewWithdrawRequests, 
},
{
  path: '/add-setting', 
  component: SettingAdd, 
},
{
  path: '/view-settings', 
  component: SettingView, 
},
{
  path: '/add-purchase', 
  component: PurchaseAdd, 
},
{
  path: '/view-purchase', 
  component: PurchaseView, 
},
{
  path: '/add-purchase-request', 
  component: PurchaseRequestAdd, 
},
{
  path: '/view-purchase-request', 
  component: PurchaseRequestView, 
},
{
  path: '/add-maintenance', 
  component: MaintenanceAdd, 
},
{
  path: '/view-maintenance', 
  component: MaintenanceView, 
},

{
  path: '/add-item-assignments', 
  component: ItemAssignmentAdd, 
},
{
  path: '/view-item-assignments', 
  component: ItemAssignmentView, 
},
{
  path: '/add-service-type', 
  component: ServiceTypeAdd,
},
{
  path: '/view-service-types', 
  component: ServiceTypeView,  
},
]

export default routes