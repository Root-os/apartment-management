import { lazy } from 'react';

const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Page404 = lazy(() => import('../pages/protected/404'));
const Blank = lazy(() => import('../pages/protected/Blank'));
const Bills = lazy(() => import('../pages/protected/Bills'));
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'));

const FloorAdd = lazy(() => import('../pages/protected/FloorAdd'));
const FloorView = lazy(() => import('../pages/protected/FloorView'));

const UnitAdd = lazy(() => import('../pages/protected/UnitAdd'));
const UnitView = lazy(() => import('../pages/protected/UnitView'));

const BillPaymentView = lazy(() => import('../pages/protected/BillPaymentView'));
const BillPaymentAdd = lazy(() => import('../pages/protected/BillPaymentAdd'));

const GovBillPaymentPage = lazy(() => import('../pages/protected/GovPaymentView'));
const GovBillPaymentAdd = lazy(() => import('../pages/protected/GovPaymentAdd'));

const ExpenseAdd = lazy(() => import('../pages/protected/ExpenseAdd'));
const ExpenseView = lazy(() => import('../pages/protected/ExpenseView'));

const ExpenseTypeAdd = lazy(() => import('../pages/protected/ExpenseTypeAdd'));
const ExpenseTypeView = lazy(() => import('../pages/protected/ExpenseTypeView'));

const TenantAdd = lazy(() => import('../pages/protected/TenantAdd'));
const TenantView = lazy(() => import('../pages/protected/TenantView'));
const TenantBillAdd = lazy(() => import('../pages/protected/TenantBillAdd'));
const TenantBillView = lazy(() => import('../pages/protected/TenantBillView'));
const TenDays = lazy(() => import('../pages/protected/tendaysTenants'));
const TenantFilter = lazy(() => import('../pages/protected/tenantfilterlist'));

const RentAdd = lazy(() => import('../pages/protected/RentAdd'));
const RentView = lazy(() => import('../pages/protected/RentView'));

const ParkingAdd = lazy(() => import('../pages/protected/ParkingAdd'));
const ParkingView = lazy(() => import('../pages/protected/ParkingView'));

// Inventory
const ItemTypeAdd = lazy(() => import('../pages/protected/ItemTypeAdd'));
const ItemTypeView = lazy(() => import('../pages/protected/ItemTypeView'));
const ItemAdd = lazy(() => import('../pages/protected/Item/ItemAdd'));
const ItemView = lazy(() => import('../pages/protected/Item/ItemView'));

const PaymentRequestAdd = lazy(() => import('../pages/protected/PaymentRequestAdd'));
const PaymentRequestView = lazy(() => import('../pages/protected/PaymentRequestView'));

// Notification
const notficationAdd = lazy(() => import('../pages/protected/Notfication/add'));
const allNotfication = lazy(() => import('../pages/protected/Notfication/viewAll'));
const bulkNotfication = lazy(() => import('../pages/protected/Notfication/bulkNotfi'));

// Email
const singleEmail = lazy(() => import('../pages/protected/email/addsingleEmail'));
const BulkEmail = lazy(() => import('../pages/protected/email/bulkEmail'));
const sentEmails = lazy(() => import('../pages/protected/email/sentEmail'));

const NotificationTypeAdd = lazy(() => import('../pages/protected/NotificationTypeAdd'));
const NotificationTypeView = lazy(() => import('../pages/protected/NotificationTypeView'));

// User
const ALlUser = lazy(() => import('../pages/protected/user/alluser'));

const ChargingAdd = lazy(() => import('../pages/protected/ChargingAdd'));
const ChargingView = lazy(() => import('../pages/protected/ChargingView'));

//Report
const GovtReport=lazy(() => import('../pages/protected/Report/govtBillReport'))
const TenantReportPage=lazy(() => import('../pages/protected/Report/tenantBillReport'))
const TenantReportPageTwo=lazy(() => import('../pages/protected/Report/tenantReport'))
const ExpenseReportPage=lazy(() => import('../pages/protected/Report/ExpenseReport'))   
const ReturnReport=lazy(() => import('../pages/protected/Report/returnReport'))
const PaymentReport=lazy(() => import('../pages/protected/Report/paymentReport'))
const PurchaseReport=lazy(() => import('../pages/protected/Report/Purchasereport'))
const ChargingReport=lazy(() => import('../pages/protected/ChargingReport'))
const MaintenanceReport=lazy(() => import('../pages/protected/MaintenanceReport'))
const ItemAssignmentReport=lazy(() => import('../pages/protected/ItemAssignmentReport'))



// Complaint tenant side
const ComplainByTenant = lazy(() => import('../pages/protected/ComplainByTenant'));
const ComplainByTenantView = lazy(() => import('../pages/protected/ComplainByTenantView'));

// Complaint admin side
const ComplainFromTenant = lazy(() => import('../pages/protected/ComplainFromTenant'));
const AssignedStaff = lazy(() => import('../pages/protected/AssignedStaff'));

// Withdraw request tenant side
const WithdrawRequestAdd = lazy(() => import('../pages/protected/WithdrawRequestAdd'));
const MyWithdrawRequest = lazy(() => import('../pages/protected/MyWithdrawRequests'));

// Withdraw request admin side
const ViewWithdrawRequests = lazy(() => import('../pages/protected/ViewWithdrawRequests'));

// Setting
const SettingAdd = lazy(() => import('../pages/protected/SettingAdd'));
const SettingView = lazy(() => import('../pages/protected/SettingView'));

// Purchase
const PurchaseAdd = lazy(() => import('../pages/protected/PurchaseAdd'));
const PurchaseView = lazy(() => import('../pages/protected/PurchaseView'));

// Purchase request
const PurchaseRequestAdd = lazy(() => import('../pages/protected/PurchaseRequestAdd'));
const PurchaseRequestView = lazy(() => import('../pages/protected/PurchaseRequestView'));

// Maintenance
const MaintenanceAdd = lazy(() => import('../pages/protected/MaintenanceAdd'));
const MaintenanceView = lazy(() => import('../pages/protected/MaintenanceView'));

// Item assignments
const ItemAssignmentAdd = lazy(() => import('../pages/protected/ItemAssignmentAdd'));
const ItemAssignmentView = lazy(() => import('../pages/protected/ItemAssignmentView'));

// Stock
const StockView = lazy(() => import('../pages/protected/StockOut/StockView'));
const LowLevelStock = lazy(() => import('../pages/protected/StockOut/LowLevelStock'));
//stock-empoyee-side
const InitialRequest = lazy(() => import('../pages/protected/StockOut/InitialRequest'));
const EmpRequestHistory = lazy(() => import('../pages/protected/StockOut/EmpRequestHistory'));

// Inventory in and out
const InOutAdd = lazy(() => import('../pages/protected/Inventory-in-out/InOutAdd'));
const ViewInOut = lazy(() => import('../pages/protected/Inventory-in-out/ViewInOut'));
const tenantViewInOut = lazy(() => import('../pages/protected/Inventory-in-out/tenantViewInOut'));

// Employee Salary
const MassSalary = lazy(() => import('../pages/protected/Employee-Salary/MassSalary'));
const SinglePayment = lazy(() => import('../pages/protected/Employee-Salary/SinglePayment'));
const ViewAllPayment = lazy(() => import('../pages/protected/Employee-Salary/ViewAllPayment'));

const RegisterEmployee = lazy(() => import('../pages/protected/Employee/EmployeeRegister'));
const AllEmployee = lazy(() => import('../pages/protected/Employee/AllEmployee'));
const MySallary = lazy(() => import('../pages/protected/Employee-Salary/MySallary'));//employee side

//service type
const ServiceTypeAdd =lazy(() => import('../pages/protected/serviceType/add'))
const ServiceTypeView =lazy(() => import('../pages/protected/serviceType/viewAll'))

//vendor
const VendorAdd =lazy(() => import('../pages/protected/vendor/add'))
const VendorView =lazy(() => import('../pages/protected/vendor/allVendor'))

//return
const ReturnAdd =lazy(() => import('../pages/protected/return/add'))
const ReturnView = lazy(() => import('../pages/protected/return/allReturn'))

//payment
const PaymentTypeAdd = lazy(() => import('../pages/protected/PaymentType/PaymentTypeAdd'))
const PaymentTypeView = lazy(() => import('../pages/protected/PaymentType/PaymentTypeView'))
const PaymentAdd = lazy(() => import('../pages/protected/payment/addPayment'))
const PaymentView = lazy(() => import('../pages/protected/payment/allPayment'))

//letter
const LetterTypeAdd = lazy(() => import('../pages/protected/letter/addLetterType'))
const letterTypeView = lazy(() => import('../pages/protected/letter/allLetterType'))
const LetterSend = lazy(() => import('../pages/protected/letter/sendLetter'))
const AllSentLetters=lazy(() => import('../pages/protected/letter/allLetterSent'))

//stock

//order
const addOrderType=lazy(() => import('../pages/protected/order/orderTypeAdd'))
const orderType=lazy(() => import ('../pages/protected/order/viewOrdertype'))
const tenantOrderPage=lazy(()=> import('../pages/protected/order/tenantOrderpage'))
const myOrder=lazy(()=> import('../pages/protected/order/myOrder'))
const allOrders=lazy(()=> import('../pages/protected/order/allOrder'))

//asset
const AssetAdd = lazy(() => import('../pages/protected/Asset/AssetAdd'))
const AssetView = lazy(() => import('../pages/protected/Asset/AssetView'))
const AssetAuditAdd = lazy(() => import('../pages/protected/AssetAudit/AssetAuditAdd'))
const AssetAuditView = lazy(() => import('../pages/protected/AssetAudit/AssetAuditView'))
const AssetAuditReport = lazy(() => import('../pages/protected/AssetAudit/AssetAuditReport'))




const role = localStorage.getItem('role');

const tenantRoutes = [
  {
    path: '/',
    component: Dashboard,
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
  {
    path: '/tenant-view-in',
    component: tenantViewInOut,
  },
  {
    path: '/view-order-menu', 
    component: tenantOrderPage,
  },
  {
    path: '/my-order',
    component: myOrder,
  }
];

const employeeRoutes = [
  {
    path: '/',
    component: Dashboard,
  },
  {
    path: '/employee-request-history',
    component: EmpRequestHistory,
  },
  {
    path: '/employee-initial-request',
    component: InitialRequest,
  },
  {
    path: '/employee-salary',
    component: MySallary,
  },
  {
    path: '/add-purchase-request',
    component: PurchaseRequestAdd,
  },
];

const adminRoutes = [
  {
    path: '/',
    component: Dashboard,
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
    path: '/tenant-bill-add',
    component: TenantBillAdd,
  },
  {
    path: '/tenant-bill-view',
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
  {
    path: '/item-assignment-report',
    component: ItemAssignmentReport,
  },
  {
    path: '/complain-from-tenant',
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
    path: '/view-stocks',
    component: StockView,
  },
  {
    path: '/view-low-level-stock',
    component: LowLevelStock,
  },
  {
    path: '/add-in-out',
    component: InOutAdd,
  },
  {
    path: '/view-in-out',
    component: ViewInOut,
  },
  {
    path: '/add-mass-salary',
    component: MassSalary,
  },
  {
    path: '/add-single-salary',
    component: SinglePayment,
  },
  {
    path: '/view-all-salary',
    component: ViewAllPayment,
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
    path: '/charging-report', 
    component: ChargingReport, 
  },
  {
    path: '/maintenance-report', 
    component: MaintenanceReport, 
  },
  {
    path: '/return-report', 
    component: ReturnReport,
  },
  {
    path: '/payment-report', 
    component: PaymentReport,
  },
  {
    path: '/item-assignment-report', 
    component: ItemAssignmentReport, 
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

//service type
{
  path: '/add-service-type', 
  component: ServiceTypeAdd,
},
{
  path: '/view-service-types', 
  component: ServiceTypeView,  
},

//vendor
{
  path: '/add-vendor', 
  component: VendorAdd,
},
{
  path: '/view-vendors', 
  component: VendorView,  
},

//return

{
  path: '/add-return', 
  component: ReturnAdd,
},
{
  path: '/view-returns', 
  component: ReturnView,
}  ,

//payment
{
  path: '/add-payment-type', 
  component: PaymentTypeAdd,
},
{
  path: '/view-payment-type', 
  component: PaymentTypeView,
},
{
  path: '/add-payment', 
  component: PaymentAdd,
},

{
  path: '/view-payments', 
  component: PaymentView,
},

//letter
{
  path: '/add-letter-type', 
  component: LetterTypeAdd,
},
{
  path: '/view-letter-types', 
  component: letterTypeView,
},
{
  path: '/send-letter', 
  component: LetterSend,
},
{
  path: '/all-sent-letters', 
  component: AllSentLetters,  
},



//stock
{
  path: '/view-stocks', 
  component: StockView, 
},

//order
{
  path: '/add-orderType', 
  component: addOrderType,
},
{
  path: '/view-order-types', 
  component: orderType,
},
{
  path: '/all-order', 
  component: allOrders,
},
{
  path: '/add-asset', 
  component: AssetAdd,
},
{
  path: '/view-asset', 
  component: AssetView,
},
{
  path: '/add-asset-audit', 
  component: AssetAuditAdd,
},
{
  path: '/view-asset-audit', 
  component: AssetAuditView,
},
{
  path: '/view-audit-report', 
  component: AssetAuditReport,
},
{
  path: '/add-employee', 
  component: RegisterEmployee,
},
{
  path: '/view-employee', 
  component: AllEmployee,
}


];
const routes = role === 'tenant' ? tenantRoutes : role === 'employee' ? employeeRoutes : adminRoutes;

export default routes;

