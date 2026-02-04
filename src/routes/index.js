import { lazy } from "react";
import { jwtDecode } from "jwt-decode";
const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Blank = lazy(() => import("../pages/protected/Blank"));
const Bills = lazy(() => import("../pages/protected/Bills"));
const ProfileSettings = lazy(() => import("../pages/protected/ProfileSettings"));
const TenantProfileSetting = lazy(() => import("../pages/protected/ProfileSetting/TenantProfileSetting"));
const TenantUnits = lazy(() => import("../pages/protected/tenantvehicle/TenantUnits"));
const TenantProfile = lazy(() => import("../pages/protected/tenantvehicle/TenantProfile"));

//building
const FloorAdd = lazy(() => import("../pages/protected/FloorAdd"));
const FloorView = lazy(() => import("../pages/protected/FloorView"));
const UnitAdd = lazy(() => import("../pages/protected/UnitAdd"));
const UnitView = lazy(() => import("../pages/protected/UnitView"));
const NewBuildingLaw = lazy(() =>
  import("../pages/protected/BuildingLaw/NewBuildingLaw")
);
const ViewBuildingLaw = lazy(() => import("../pages/protected/BuildingLaw/ViewBuildingLaw"));
const LawLetter = lazy(() => import("../pages/protected/BuildingLaw/LawLetter"));
const BillPaymentView = lazy(() => import("../pages/protected/BillPaymentView"));
const BillPaymentAdd = lazy(() => import("../pages/protected/BillPaymentAdd"));

const GovBillPaymentPage = lazy(() => import("../pages/protected/GovPaymentView"));
const GovBillPaymentAdd = lazy(() => import("../pages/protected/GovPaymentAdd"));

const ExpenseAdd = lazy(() => import("../pages/protected/ExpenseAdd"));
const ExpenseView = lazy(() => import("../pages/protected/ExpenseView"));

const ExpenseTypeAdd = lazy(() => import("../pages/protected/ExpenseTypeAdd"));
const ExpenseTypeView = lazy(() => import("../pages/protected/ExpenseTypeView"));

const TenantAdd = lazy(() => import("../pages/protected/TenantAdd"));
const TenantView = lazy(() => import("../pages/protected/TenantView"));
const TenantBillAdd = lazy(() => import("../pages/protected/TenantBillAdd"));
const TenantBillView = lazy(() => import("../pages/protected/TenantBillView"));
const TenDays = lazy(() => import("../pages/protected/tendaysTenants"));
const TenantFilter = lazy(() => import("../pages/protected/tenantfilterlist"));
const NewVehicle = lazy(() => import("../pages/protected/tenantvehicle/NewVehicle"));
const TenantVehicles = lazy(() => import("../pages/protected/tenantvehicle/ViewVehicle"));
const TenantViewRent = lazy(() => import("../pages/protected/Rent/TenantViewRent"));

const RentAdd = lazy(() => import("../pages/protected/RentAdd"));
const RentView = lazy(() => import("../pages/protected/RentView"));

const ParkingAdd = lazy(() => import("../pages/protected/ParkingAdd"));
const ParkingView = lazy(() => import("../pages/protected/ParkingView"));

// Inventory
const ItemTypeAdd = lazy(() => import("../pages/protected/ItemTypeAdd"));
const ItemTypeView = lazy(() => import("../pages/protected/ItemTypeView"));
const ItemAdd = lazy(() => import("../pages/protected/Item/ItemAdd"));
const ItemView = lazy(() => import("../pages/protected/Item/ItemView"));

const PaymentRequestAdd = lazy(() =>
  import("../pages/protected/PaymentRequestAdd")
);
const PaymentRequestView = lazy(() =>
  import("../pages/protected/PaymentRequestView")
);
const TenantViewRequest = lazy(() =>
  import("../pages/protected/PaymentRequest/TenantViewRequest")
);
const ViewReciept = lazy(()=> import("../pages/protected/PaymentRequest/ViewReciept"))

// Notification
const notficationAdd = lazy(() => import("../pages/protected/Notfication/add"));
const allNotfication = lazy(() =>
  import("../pages/protected/Notfication/viewAll")
);
const bulkNotfication = lazy(() =>
  import("../pages/protected/Notfication/bulkNotfi")
);
const MyNotification = lazy(() =>
  import("../pages/protected/Notfication/MyNotification")
);
const EmpNotfication = lazy(() =>
  import("../pages/protected/Notfication/EmpNotfication")
);

// Email
const singleEmail = lazy(() =>
  import("../pages/protected/email/addsingleEmail")
);
const BulkEmail = lazy(() => import("../pages/protected/email/bulkEmail"));
const sentEmails = lazy(() => import("../pages/protected/email/sentEmail"));

const NotificationTypeAdd = lazy(() =>
  import("../pages/protected/NotificationTypeAdd")
);
const NotificationTypeView = lazy(() =>
  import("../pages/protected/NotificationTypeView")
);

//SMS
const SendSms = lazy(() => import("../pages/protected/SMS/SendSms"));
const BulkSms = lazy(() => import("../pages/protected/SMS/BulkSms"));
const ViewSms = lazy(() => import("../pages/protected/SMS/ViewSms"));

// User
const ALlUser = lazy(() => import("../pages/protected/user/alluser"));
const UserRegister = lazy(() => import("../pages/protected/user/UserRegister"));

const ChargingAdd = lazy(() => import("../pages/protected/ChargingAdd"));
const ChargingView = lazy(() => import("../pages/protected/ChargingView"));

//Report
const GovtReport = lazy(() =>
  import("../pages/protected/Report/govtBillReport")
);
const TenantReportPage = lazy(() =>
  import("../pages/protected/Report/tenantBillReport")
);
const TenantReportPageTwo = lazy(() =>
  import("../pages/protected/Report/tenantReport")
);
const ExpenseReportPage = lazy(() =>
  import("../pages/protected/Report/ExpenseReport")
);
const ReturnReport = lazy(() =>
  import("../pages/protected/Report/returnReport")
);
const PaymentReport = lazy(() =>
  import("../pages/protected/Report/paymentReport")
);
const PurchaseReport = lazy(() =>
  import("../pages/protected/Report/Purchasereport")
);
const ChargingReport = lazy(() => import("../pages/protected/ChargingReport"));
const MaintenanceReport = lazy(() =>
  import("../pages/protected/MaintenanceReport")
);
const ItemAssignmentReport = lazy(() =>
  import("../pages/protected/ItemAssignmentReport")
);
const RevenueReport = lazy(() =>
  import("../pages/protected/Report/RevenueReport")
);

// Complaint tenant side
const ComplainByTenant = lazy(() =>
  import("../pages/protected/ComplainByTenant")
);
const ComplainByTenantView = lazy(() =>
  import("../pages/protected/ComplainByTenantView")
);
const ViewAssigned = lazy(() =>
  import("../pages/protected/complain/ViewAssigned")
);

// Complaint admin
const ComplainFromTenant = lazy(() =>
  import("../pages/protected/ComplainFromTenant")
);
const AssignedStaff = lazy(() => import("../pages/protected/AssignedStaff"));
// Withdraw request tenant side
const WithdrawRequestAdd = lazy(() =>
  import("../pages/protected/WithdrawRequestAdd")
);
const MyWithdrawRequest = lazy(() =>
  import("../pages/protected/MyWithdrawRequests")
);
// Withdraw request admin side
const ViewWithdrawRequests = lazy(() =>
  import("../pages/protected/ViewWithdrawRequests")
);
// Setting
const SettingAdd = lazy(() => import("../pages/protected/SettingAdd"));
const SettingView = lazy(() => import("../pages/protected/SettingView"));

const ViewPaymentSetting = lazy(() => import("../pages/protected/PaymentSetting/ViewPaymentSetting"));
const CreatePaymentsetting = lazy(() => import("../pages/protected/PaymentSetting/CreatePaymentSetting"));

const CalendarToggle = lazy(() =>
  import("../pages/protected/setting/CalendarToggle")
);
const ApplyPunishment = lazy(() => import("../pages/protected/setting/ApplyPunishment"))
// Purchase
const PurchaseAdd = lazy(() => import("../pages/protected/PurchaseAdd"));
const PurchaseView = lazy(() => import("../pages/protected/PurchaseView"));
// Purchase request
const PurchaseRequestAdd = lazy(() =>
  import("../pages/protected/PurchaseRequestAdd")
);
const PurchaseRequestView = lazy(() =>
  import("../pages/protected/PurchaseRequestView")
);
// Maintenance
const MaintenanceAdd = lazy(() => import("../pages/protected/MaintenanceAdd"));
const MaintenanceView = lazy(() =>
  import("../pages/protected/MaintenanceView")
);
// Item assignments
const ItemAssignmentAdd = lazy(() =>
  import("../pages/protected/ItemAssignmentAdd")
);
const ItemAssignmentView = lazy(() =>
  import("../pages/protected/ItemAssignmentView")
);
// Stock
const StockView = lazy(() => import("../pages/protected/StockOut/StockView"));
const LowLevelStock = lazy(() =>
  import("../pages/protected/StockOut/LowLevelStock")
);
//stock-empoyee-side
const InitialRequest = lazy(() =>
  import("../pages/protected/StockOut/InitialRequest")
);
const EmpRequestHistory = lazy(() =>
  import("../pages/protected/StockOut/EmpRequestHistory")
);

// Inventory in and out
const InOutAdd = lazy(() =>
  import("../pages/protected/Inventory-in-out/InOutAdd")
);
const ViewInOut = lazy(() =>
  import("../pages/protected/Inventory-in-out/ViewInOut")
);
const ViewDetail = lazy(() =>
  import("../pages/protected/Inventory-in-out/ViewDetail")
);
const tenantViewInOut = lazy(() =>
  import("../pages/protected/Inventory-in-out/tenantViewInOut")
);
// Employee Salary
const MassSalary = lazy(() =>
  import("../pages/protected/Employee-Salary/MassSalary")
);
const SinglePayment = lazy(() =>
  import("../pages/protected/Employee-Salary/SinglePayment")
);
const ViewAllPayment = lazy(() =>
  import("../pages/protected/Employee-Salary/ViewAllPayment")
);

const RegisterEmployee = lazy(() =>
  import("../pages/protected/Employee/EmployeeRegister")
);
const AllEmployee = lazy(() =>
  import("../pages/protected/Employee/AllEmployee")
);
const MySallary = lazy(() =>
  import("../pages/protected/Employee-Salary/MySallary")
); //employee side
//service type
const ServiceTypeAdd = lazy(() => import("../pages/protected/serviceType/add"));
const ServiceTypeView = lazy(() =>
  import("../pages/protected/serviceType/viewAll")
);
//vendor
const VendorAdd = lazy(() => import("../pages/protected/vendor/add"));
const VendorView = lazy(() => import("../pages/protected/vendor/allVendor"));
//return
const ReturnAdd = lazy(() => import("../pages/protected/return/add"));
const ReturnView = lazy(() => import("../pages/protected/return/allReturn"));
//payment
const PaymentTypeAdd = lazy(() =>
  import("../pages/protected/PaymentType/PaymentTypeAdd")
);
const PaymentTypeView = lazy(() =>
  import("../pages/protected/PaymentType/PaymentTypeView")
);
const PaymentAdd = lazy(() => import("../pages/protected/payment/addPayment"));
const PaymentView = lazy(() => import("../pages/protected/payment/allPayment"));
const PaymentReciept = lazy(() => import("../pages/protected/PaymentReciept"));
const TenantViewBills = lazy(() =>
  import("../pages/protected/BillPayment/TenantViewBills")
);
//letter
const LetterTypeAdd = lazy(() =>
  import("../pages/protected/letter/addLetterType")
);
const letterTypeView = lazy(() =>
  import("../pages/protected/letter/allLetterType")
);
const LetterSend = lazy(() => import("../pages/protected/letter/sendLetter"));
const AllSentLetters = lazy(() =>
  import("../pages/protected/letter/allLetterSent")
);
const PdfLetter = lazy(() => import("../pages/protected/letter/PdfLetter"));
const MyLetter = lazy(() => import("../pages/protected/letter/MyLetter"));
const NewResponse = lazy(() =>
  import("../pages/protected/Letter-Response/NewResponse")
);
const TenantViewResponse = lazy(() =>
  import("../pages/protected/Letter-Response/TenantViewResponse")
);
const AdminViewResponse = lazy(() =>
  import("../pages/protected/Letter-Response/AdminViewResponse")
);
//stock
//order
const addOrderType = lazy(() =>
  import("../pages/protected/order/orderTypeAdd")
);
const orderType = lazy(() => import("../pages/protected/order/viewOrdertype"));
const tenantOrderPage = lazy(() =>
  import("../pages/protected/order/tenantOrderpage")
);
const myOrder = lazy(() => import("../pages/protected/order/myOrder"));
const allOrders = lazy(() => import("../pages/protected/order/allOrder"));
const BookingPage = lazy (() => import("../features/order/booking"));
//asset
const AssetAdd = lazy(() => import("../pages/protected/Asset/AssetAdd"));
const AssetView = lazy(() => import("../pages/protected/Asset/AssetView"));
const AssetAuditAdd = lazy(() =>
  import("../pages/protected/AssetAudit/AssetAuditAdd")
);
const AssetAuditView = lazy(() =>
  import("../pages/protected/AssetAudit/AssetAuditView")
);
const AssetAuditReport = lazy(() =>
  import("../pages/protected/AssetAudit/AssetAuditReport")
);
const NavigateAuditHistory = lazy(() =>
  import("../pages/protected/AssetAudit/NavigateAuditHistory")
);
//Role
const RoleAdd = lazy(() => import("../pages/protected/Role/RoleAdd"));
const RoleView = lazy(() => import("../pages/protected/Role/RoleView"));
//permission
const PermissionAdd = lazy(() =>
  import("../pages/protected/permission/PermissionAdd")
);
const PermissionView = lazy(() =>
  import("../pages/protected/permission/PermissionView")
);
const AssignPermission = lazy(() =>
  import("../pages/protected/permission/AssignPermission")
);
const RevokePermission = lazy(() =>
  import("../pages/protected/permission/RevokePermission")
);
//item out request
const SendOutRequest = lazy(() =>
  import("../pages/protected/ItemOutRequest/SendOutRequest")
);
const ViewOutRequests = lazy(() =>
  import("../pages/protected/ItemOutRequest/ViewOutRequests")
);
const AdminViewRequest = lazy(() =>
  import("../pages/protected/ItemOutRequest/AdminViewRequest")
);
const ViewTenantItems = lazy(() =>
  import("../pages/protected/ItemOutRequest/ViewTenantItems")
);
const Detail = lazy(() =>
  import("../pages/protected/ItemOutRequest/Detail")
);
const SeeMyItems = lazy(() =>
  import("../pages/protected/ItemOutRequest/SeeMyItems")
);

const Gallery = lazy(() => import("../pages/protected/setting/Gallery"));



const token = localStorage.getItem("token");

const tenantRoutes = [
  { path: "/", component: Dashboard },
  { path: "/complain-tenant-add", component: ComplainByTenant },
  { path: "/complain-tenant-view", component: ComplainByTenantView },
  { path: "/withdraw-request-add", component: WithdrawRequestAdd },
  { path: "/withdraw-request-view", component: MyWithdrawRequest },
  { path: "/tenant-view-in", component: tenantViewInOut },
  { path: "/view-order-menu", component: tenantOrderPage },
  { path: "/my-order", component: myOrder },
  { path: "/my-notification", component: MyNotification },
  { path: "/law-letter", component: LawLetter },
  { path: "/my-letter", component: MyLetter },
  { path: "/new-letter-response", component: NewResponse },
  { path: "/tenant-view-response", component: TenantViewResponse },
  { path: "/tenant-rent-collection", component: TenantViewRent },
  { path: "/tenant-payment-history", component: TenantViewBills },
  { path: "/payment-request-history", component: TenantViewRequest },
  { path: "/view-reciept/:paymentRequestId", component: ViewReciept },
  { path: "/item-out-request", component: SendOutRequest },
  { path: "/out-requests", component: ViewOutRequests },
  { path: "/see-my-items", component: SeeMyItems },
  { path: "/tenant-profile", component: TenantProfileSetting },
  { path: "/units", component: TenantUnits},
  { path: "/profile", component: TenantProfile }
];

const employeeRoutes = [
  { path: "/", component: Dashboard },
  { path: "/employee-request-history", component: EmpRequestHistory },
  { path: "/employee-initial-request", component: InitialRequest },
  { path: "/employee-salary", component: MySallary },
  { path: "/add-purchase-request", component: PurchaseRequestAdd },
  { path: "/view-purchase-request", component: PurchaseRequestView },
  { path: "/view-my-notfication", component: EmpNotfication },
  { path: "/view-assigned-complain", component: ViewAssigned },
];

const adminRoutes = [
  {
    name: "dashboard",
    routes: [
      { path: "/", component: Dashboard },
      { path: "/settings-profile", component: ProfileSettings },
      { path: "/settings-billing", component: Bills },
      { path: "/404", component: Page404 },
      { path: "/blank", component: Blank },
    ],
  },
  {
    name: "building",
    routes: [
      { path: "/add-floor", component: FloorAdd },
      { path: "/view-floor", component: FloorView },
      { path: "/add-unit", component: UnitAdd },
      { path: "/view-unit", component: UnitView },
      { path: "/add-building-law", component: NewBuildingLaw },
      { path: "/view-building-law", component: ViewBuildingLaw },
      { path: "/law-letter", component: LawLetter },
    ],
  },
  {
    name: "Finance",
    routes: [
      { path: "/add-bill-type", component: BillPaymentAdd },
      { path: "/view-bill-type", component: BillPaymentView },
      { path: "/add-payment-for-goverment", component: GovBillPaymentAdd },
      { path: "/view-payment-for-goverment", component: GovBillPaymentPage },
      { path: "/tenant-bill-add", component: TenantBillAdd },
      { path: "/tenant-bill-view", component: TenantBillView },
      { path: "/expense-add", component: ExpenseAdd },
      { path: "/expense-view", component: ExpenseView },
      { path: "/expense-type-add", component: ExpenseTypeAdd },
      { path: "/expense-type-view", component: ExpenseTypeView },
      { path: "/add-payment-type", component: PaymentTypeAdd },
      { path: "/view-payment-type", component: PaymentTypeView },
      { path: "/add-payment", component: PaymentAdd },
      { path: "/view-payments", component: PaymentView },
      { path: "/payment-request-add", component: PaymentRequestAdd },
      { path: "/payment-request-view", component: PaymentRequestView },
      { path: "/view-reciept/:paymentRequestId", component: ViewReciept },
      { path: "/add-mass-salary", component: MassSalary },
      { path: "/add-single-salary", component: SinglePayment },
      { path: "/view-all-salary", component: ViewAllPayment },
    ],
  },
  {
    name: "tenant",
    routes: [
      { path: "/tenant-add", component: TenantAdd },
      { path: "/tenant-view", component: TenantView },
      { path: "/ten-days-tenant", component: TenDays },
      { path: "/tenant-filter", component: TenantFilter },
      { path: "/complain-from-tenant", component: ComplainFromTenant },
      { path: "/admin-view-assigneds", component: AssignedStaff },
      { path: "/view-withdraw-requests", component: ViewWithdrawRequests },
      { path: "/rent-collection-add", component: RentAdd },
      { path: "/rent-collection-view", component: RentView },
      { path: "/add-tenant-vehicle", component: NewVehicle },
      { path: "/tenant/:tenantId/vehicles", component: TenantVehicles },
    ],
  },
  {
    name: "utility",
    routes: [
      { path: "/charging-add", component: ChargingAdd },
      { path: "/charging-view", component: ChargingView },
      { path: "/payment-receipt", component: PaymentReciept },
      { path: "/add-return", component: ReturnAdd },
      { path: "/view-returns", component: ReturnView },
      { path: "/add-maintenance", component: MaintenanceAdd },
      { path: "/view-maintenance", component: MaintenanceView },
      { path: "/parking-add", component: ParkingAdd },
      { path: "/parking-view", component: ParkingView },
    ],
  },
  {
    name: "inventory",
    routes: [
      { path: "/item-type-add", component: ItemTypeAdd },
      { path: "/item-type-view", component: ItemTypeView },
      { path: "/item-add", component: ItemAdd },
      { path: "/item-view", component: ItemView },
      { path: "/add-in-out", component: InOutAdd },
      { path: "/view-in-out", component: ViewInOut },
      { path: "/tenant-inventory/:phoneNumber", component: ViewDetail},
      { path: "/view-stocks", component: StockView },
      { path: "/view-low-level-stock", component: LowLevelStock },
      { path: "/see-out-requests", component: AdminViewRequest },
      { path: "/see-tenant-items/:id", component: ViewTenantItems },
      { path: "/see-request-detail", component: Detail},
      { path: "/navigate-audit-history", component: NavigateAuditHistory },
    ],
  },
  {
    name: "Item Assignments",
    routes: [
      { path: "/add-item-assignments", component: ItemAssignmentAdd },
      { path: "/view-item-assignments", component: ItemAssignmentView },
    ],
  },
  {
    name: "communication",
    routes: [
      { path: "/notfication-type-add", component: NotificationTypeAdd },
      { path: "/notfication-type-view", component: NotificationTypeView },
      { path: "/add-notfication", component: notficationAdd },
      { path: "/Send-bulk-notfication", component: bulkNotfication },
      { path: "/all-notfication", component: allNotfication },
      { path: "/send-single-email", component: singleEmail },
      { path: "/send-bulk-email", component: BulkEmail },
      { path: "/send-emails", component: sentEmails },
      { path: "/add-letter-type", component: LetterTypeAdd },
      { path: "/view-letter-types", component: letterTypeView },
      { path: "/send-letter", component: LetterSend },
      { path: "/all-sent-letters", component: AllSentLetters },
      { path: "/letters-in-pdf", component: PdfLetter },
      { path: "/letter-response/:letterId", component: AdminViewResponse },
      { path: "/send-single-message", component: SendSms },
      { path: "/send-bulk-sms", component: BulkSms },
      { path: "/view-sms", component: ViewSms },
    ],
  },
  {
    name: "reports",
    routes: [
      { path: "/govt-bill-report", component: GovtReport },
      { path: "/tenant-bill-report", component: TenantReportPage },
      { path: "/tenant-report", component: TenantReportPageTwo },
      { path: "/expense-report", component: ExpenseReportPage },
      { path: "/purchase-report", component: PurchaseReport },
      { path: "/charging-report", component: ChargingReport },
      { path: "/maintenance-report", component: MaintenanceReport },
      { path: "/return-report", component: ReturnReport },
      { path: "/payment-report", component: PaymentReport },
      { path: "/item-assignment-report", component: ItemAssignmentReport },
      { path: "/view-revenue-report", component: RevenueReport },
      { path: "/view-audit-report", component: AssetAuditReport },
    ],
  },
  {
    name: "purchase",
    routes: [
      { path: "/add-purchase", component: PurchaseAdd },
      { path: "/view-purchase", component: PurchaseView },
      { path: "/add-purchase-request", component: PurchaseRequestAdd },
      { path: "/view-purchase-request", component: PurchaseRequestView },
      { path: "/add-service-type", component: ServiceTypeAdd },
      { path: "/view-service-types", component: ServiceTypeView },
      { path: "/add-vendor", component: VendorAdd },
      { path: "/view-vendors", component: VendorView },
    ],
  },
  {
    name: "Order",
    routes: [
      { path: "/add-orderType", component: addOrderType },
      { path: "/view-order-types", component: orderType },
      { path: "/all-order", component: allOrders },
      { path: "/all-booking", component: BookingPage },
    ],
  },
  {
    name: "Asset",
    routes: [
      { path: "/add-asset", component: AssetAdd },
      { path: "/view-asset", component: AssetView },
      { path: "/add-asset-audit", component: AssetAuditAdd },
      { path: "/view-asset-audit", component: AssetAuditView },
      { path: "/navigate-audit-history", component: NavigateAuditHistory },
    ],
  },
  {
    name: "employee",
    routes: [
      { path: "/add-employee", component: RegisterEmployee },
      { path: "/view-employee", component: AllEmployee },
    ],
  },
  {
    name: "settings",
    routes: [
      { path: "/add-setting", component: SettingAdd },
      { path: "/view-settings", component: SettingView },
      { path: "/view-payment-setting", component: ViewPaymentSetting},
      { path: "/add-account", component: CreatePaymentsetting },
      { path: "/calendar-settings", component: CalendarToggle },
      { path: "/apply-punishment", component: ApplyPunishment },
      { path: "/All-User", component: ALlUser },
      { path: "/add-role", component: RoleAdd },
      { path: "/view-role", component: RoleView },
      { path: "/add-permission", component: PermissionAdd },
      { path: "/view-permission", component: PermissionView },
      { path: "/assign-permission", component: AssignPermission },
      { path: "/revoke-permission", component: RevokePermission },
      { path: "/register-user", component: UserRegister },
      { path: "/gallery", component: Gallery},
    ],
  },
];

let routes = [];

if (token) {
  try {
    const decoded = jwtDecode(token);
    const role = decoded.role;
    const permissions = decoded.permissions || [];

    if (role === "admin") {
      // all pages
      routes = adminRoutes.flatMap(m => m.routes || []);
    } else if (role === "tenant") {
      routes = Array.isArray(tenantRoutes[0]?.routes)
    ? tenantRoutes.flatMap(m => m.routes)
    : tenantRoutes;
    } else {
      // start with employee base routes
      routes = [...employeeRoutes];

      for (const module of adminRoutes) {
        if (!module.name) continue;

        const hasPermission = permissions.some(perm =>
          perm.toLowerCase().includes(module.name.toLowerCase())
        );

        if (hasPermission && module.routes && module.routes.length > 0) {
          // ✅ add all routes (including hidden ones) for React Router
          routes = [...routes, ...module.routes];
        }
      }
    }
  } catch (error) {
    console.error("Token decode failed", error);
  }
}


export default routes;
