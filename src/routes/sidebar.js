import { jwtDecode } from "jwt-decode";

import BellIcon from "@heroicons/react/24/outline/BellIcon";
import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import TableCellsIcon from "@heroicons/react/24/outline/TableCellsIcon";
import WalletIcon from "@heroicons/react/24/outline/WalletIcon";
import CodeBracketSquareIcon from "@heroicons/react/24/outline/CodeBracketSquareIcon";
import DocumentIcon from "@heroicons/react/24/outline/DocumentIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";
import ArrowDownIcon from "@heroicons/react/24/outline/ArrowDownIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import ChartBarIcon from "@heroicons/react/24/outline/ChartBarIcon";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import InboxArrowDownIcon from "@heroicons/react/24/outline/InboxArrowDownIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import KeyIcon from "@heroicons/react/24/outline/KeyIcon";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import TagIcon from "@heroicons/react/24/outline/TagIcon";
import BookOpenIcon from "@heroicons/react/24/outline/BookOpenIcon";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import { HomeIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";
import ServerIcon from "@heroicons/react/24/outline/ServerIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import GlobeAltIcon from "@heroicons/react/24/outline/GlobeAltIcon";
import FilmIcon from "@heroicons/react/24/outline/FilmIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import CubeIcon from "@heroicons/react/24/outline/CubeIcon";
import PaperClipIcon from "@heroicons/react/24/outline/PaperClipIcon";
import CogIcon from "@heroicons/react/24/outline/CogIcon";
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon as MailIcon } from "@heroicons/react/24/outline";
import ClipboardIcon from "@heroicons/react/24/outline/ClipboardIcon";
import ShoppingBagIcon from "@heroicons/react/24/outline/ShoppingBagIcon";
import WrenchIcon from "@heroicons/react/24/outline/WrenchIcon";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import ArrowUpIcon from "@heroicons/react/24/outline/ArrowUpIcon";
import PowerIcon from "@heroicons/react/24/outline/PowerIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import ArrowUpTrayIcon from "@heroicons/react/24/outline/ArrowUpTrayIcon";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const token = localStorage.getItem("token");

const tenantRoutes = [
  {
    path: "/app",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },

  //complain
  {
    path: "",
    icon: <EnvelopeIcon className={`${iconClasses} inline`} />,
    name: "My Complain",
    submenu: [
      {
        path: "/app/complain-tenant-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Complaint",
      },
      {
        path: "/app/complain-tenant-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "My complaints",
      },
    ],
  },
  {
    path: "",
    icon: <ArrowRightOnRectangleIcon className={`${iconClasses} inline`} />,
    name: "Notice to Vacate",
    submenu: [
      {
        path: "/app/withdraw-request-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Request",
      },
      {
        path: "/app/withdraw-request-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "My Requests",
      },
    ],
  },
  {
    path: "",
    icon: <ArrowUpIcon className={`${iconClasses} inline`} />,
    name: "Inventory In Out",
    submenu: [
      {
        path: "/app/tenant-view-in",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "My In/Out record",
      },
    ],
  },
  {
    path: "",
    icon: <ShoppingBagIcon className={`${iconClasses} inline`} />,
    name: "Order",
    submenu: [
      {
        path: "/app/view-order-menu",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Menu",
      },
      {
        path: "/app/my-order",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "My Order",
      },
    ],
  },
  {
    path: "",
    icon: <MailIcon className={`${iconClasses} inline`} />,
    name: "My Communications",
    submenu: [
      {
        path: "/app/my-notification",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "My Notfication ",
      },
      {
        path: "/app/my-letter",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "My Letters",
      },
    ],
  },
  {
    path: "",
    icon: <WalletIcon className={`${iconClasses} inline`} />,
    name: "My Payment History",
    submenu: [
      {
        path: "/app/tenant-rent-collection",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "My Paid Rents ",
      },
      {
        path: "/app/tenant-payment-history",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "My Paid Bills ",
      },
    ],
  },
  {
    path: "",
    icon: <WalletIcon className={`${iconClasses} inline`} />,
    name: "My Payment Request",
    submenu: [
      {
        path: "/app/payment-request-history",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Payment Request  ",
      },
    ],
  },
  {
    path: "",
    icon: <ArrowUpTrayIcon className={`${iconClasses} inline`} />,
    name: "Item Out Request",
    submenu: [
      {
        path: "/app/item-out-request",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Send Out Request ",
      },
      {
        path: "/app/out-requests",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Out Requests ",
      },
    ],
  },
  {
    path: "/app/law-letter",
    icon: <EyeIcon className={submenuIconClasses} />,
    name: "Building Law ",
  },
  {
    path: "/app/units",
    icon: <EyeIcon className={submenuIconClasses} />,
    name: "My Rooms ",
  },
  {
    path: "/app/tenant-add-rent",
    icon: <PlusIcon className={submenuIconClasses} />,
    name: "Pay Rent",
  },
];

const employeeRoutes = [
  {
    path: "/app",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "",
    icon: <ArrowUpIcon className={`${iconClasses} inline`} />,
    name: "Stock Out",
    submenu: [
      {
        path: "/app/employee-initial-request",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Send Request",
      },
      {
        path: "/app/employee-request-history",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View My Requests",
      },
    ],
  },
  {
    path: "",
    icon: <WalletIcon className={`${iconClasses} inline`} />,
    name: "My Salary",
    submenu: [
      {
        path: "/app/employee-salary",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "My Salary History",
      },
    ],
  },
  {
    path: "",
    icon: <EnvelopeIcon className={`${iconClasses} inline`} />,
    name: "Assigned Complain",
    submenu: [
      {
        path: "/app/view-assigned-complain",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Assigned Complain",
      },
    ],
  },
  {
    path: "",
    icon: <MailIcon className={`${iconClasses} inline`} />,
    name: "Notfications",
    submenu: [
      {
        path: "/app/view-my-notfication",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "My Notfications",
      },
    ],
  },
  {
    path: "",
    icon: <CreditCardIcon className={`${iconClasses} inline`} />,
    name: "Purchase Request",
    submenu: [
      {
        path: "/app/add-purchase-request",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Purchase Request",
      },
      {
        path: "/app/view-purchase-request",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Purchase requests ",
      },
    ],
  },
];

//admin side
const adminRoutes = [
  {
    path: "/app",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "",
    icon: <HomeIcon className={`${iconClasses} inline`} />,
    name: "Building",
    submenu: [
      {
        path: "/app/add-floor",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add New Floor ",
      },
      {
        path: "/app/view-floor",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Floors",
      },
      {
        path: "/app/add-unit",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add New Unit ",
      },
      {
        path: "/app/view-unit",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Units ",
      },
      {
        path: "/app/add-building-law",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "New Building Law ",
      },
      {
        path: "/app/view-building-law",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Building Law ",
      },
    ],
  },
  {
    path: "",
    icon: <UserIcon className={`${iconClasses} inline`} />,
    name: "Tenant",
    submenu: [
      {
        path: "/app/tenant-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Register New Tenant ",
      },
      {
        path: "/app/tenant-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Tenants ",
      },
      {
        path: "/app/ten-days-tenant",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Near Expiry Tenants",
      },
      // {
      //   path: '/app/tenant-filter',
      //   icon: <EyeIcon className={submenuIconClasses}/>,
      //   name: 'Tenants Filter',
      // },
      {
        path: "/app/tenant-bill-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Tenant Bill Report",
      },
      {
        path: "/app/tenant-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Tenant Report",
      },
      {
        path: "/app/complain-from-tenant",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Complaints",
      },
      {
        path: "/app/admin-view-assigneds",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Assigned Staff for complain",
      },
      {
        path: "/app/view-withdraw-requests",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Withdraw Requests",
      },
      {
        path: "/app/rent-collection-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Collected Rent",
      },
      {
        path: "/app/rent-collection-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Collected Rents ",
      },
     {
        path: "/app/punishment-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Punishments",
      },
      
    ],
  },
  {
    path: "",
    icon: <CalendarIcon className={`${iconClasses} inline`} />,
    name: "Employee",
    submenu: [
      {
        path: "/app/add-employee",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Register Employee",
      },
      {
        path: "/app/view-employee",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View all employees",
      },
    ],
  },
  {
    path: "",
    icon: <WalletIcon className={`${iconClasses} inline`} />,
    name: "Finance",
    submenu: [
      {
        path: "/app/add-bill-type",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add New Bill Type",
      },
      {
        path: "/app/view-bill-type",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Bill Types",
      },
      {
        path: "/app/add-payment-for-goverment",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Bill Payment for gov.t",
      },
      {
        path: "/app/view-payment-for-goverment",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View paid Payments for gov.t ",
      },
      {
        path: "/app/tenant-bill-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Tenant Bills",
      },
      {
        path: "/app/tenant-bill-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Tenant Bills ",
      },
      {
        path: "/app/payment-request-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add New Payment Request",
      },
      {
        path: "/app/payment-request-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Payment Requests",
      },
      {
        path: "/app/expense-type-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add New Expense Type",
      },
      {
        path: "/app/expense-type-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Expense Types ",
      },
      {
        path: "/app/expense-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add New Expense",
      },
      {
        path: "/app/expense-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Expenses ",
      },
      {
        path: "/app/add-payment-type",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add New Payment Type",
      },
      {
        path: "/app/view-payment-type",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Payment Types",
      },
      {
        path: "/app/add-payment",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add New Payment",
      },
      {
        path: "/app/view-payments",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Payments Made",
      },

      {
        path: "/app/add-mass-salary",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Mass Employee Salary ",
      },
      {
        path: "/app/add-single-salary",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Single employee Salary",
      },
      {
        path: "/app/view-all-salary",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View All Sallery History",
      },
    ],
  },
  {
    path: "",
    icon: <CubeIcon className={`${iconClasses} inline`} />,
    name: "Inventory",
    submenu: [
      {
        path: "/app/item-type-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Item Type",
      },
      {
        path: "/app/item-type-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Item Type",
      },
      {
        path: "/app/item-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Item ",
      },
      {
        path: "/app/item-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Items",
      },
      {
        path: "/app/add-in-out",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Inventory In/Out",
      },
      {
        path: "/app/view-in-out",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Inventory information",
      },
      {
        path: "/app/see-out-requests",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Item Out Requests",
      },
      {
        path: "/app/view-stocks",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Stock out requests",
      },
      {
        path: "/app/view-low-level-stock",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Low level stock",
      },
    ],
  },
  {
    path: "",
    icon: <CreditCardIcon className={`${iconClasses} inline`} />,
    name: "Purchase",
    submenu: [
      {
        path: "/app/add-purchase",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Purchase",
      },
      {
        path: "/app/view-purchase",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Purchases ",
      },
      {
        path: "/app/add-purchase-request",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Purchase Request",
      },
      {
        path: "/app/view-purchase-request",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Purchase requests ",
      },
      {
        path: "/app/add-vendor",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "New Vendor",
      },
      {
        path: "/app/view-vendors",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Vendors",
      },
      {
        path: "/app/purchase-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Purchase Report",
      },
      {
        path: "/app/add-service-type",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Service Type Add",
      },
      {
        path: "/app/view-service-types",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Service Type",
      },
      {
        path: "/app/add-return",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "New Return",
      },
      {
        path: "/app/view-returns",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Returns",
      },
    ],
  },
  {
    path: "",
    icon: <CalendarIcon className={`${iconClasses} inline`} />,
    name: "Order",
    submenu: [
      {
        path: "/app/add-orderType",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Order Type",
      },
      {
        path: "/app/view-order-types",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Order Type",
      },
      {
        path: "/app/all-order",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "All Orders",
      },
      {
        path: "/app/all-booking",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "All Bookings",
      },
    ],
  },
  {
    path: "",
    icon: <ClipboardIcon className={`${iconClasses} inline`} />,
    name: "Item Assignments",
    submenu: [
      {
        path: "/app/add-item-assignments",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Assign Item",
      },
      {
        path: "/app/view-item-assignments",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Item Assignments",
      },
    ],
  },
  {
    path: "",
    icon: <CalendarIcon className={`${iconClasses} inline`} />,
    name: "Asset",
    submenu: [
      {
        path: "/app/add-asset",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Asset",
      },
      {
        path: "/app/view-asset",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Assets",
      },
      {
        path: "/app/add-asset-audit",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Asset Audit",
      },
      {
        path: "/app/view-asset-audit",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Asset Audits",
      },
      {
        path: "/app/view-audit-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Asset Audit Reports",
      },
    ],
  },
  {
    path: "",
    icon: <MapPinIcon className={`${iconClasses} inline`} />,
    name: "Utility",
    submenu: [
      {
        path: "/app/parking-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Parking ",
      },
      {
        path: "/app/parking-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Parking Informations ",
      },
      {
        path: "/app/charging-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Charging",
      },
      {
        path: "/app/charging-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Charging Informations",
      },
      {
        path: "/app/add-maintenance",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Maintenance",
      },
      {
        path: "/app/view-maintenance",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Maintenance informations ",
      },
    ],
  },
  {
    path: "",
    icon: <MailIcon className={`${iconClasses} inline`} />,
    name: "Communication",
    submenu: [
      {
        path: "/app/notfication-type-add",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Notfication Type",
      },
      {
        path: "/app/notfication-type-view",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Notfication Type",
      },
      {
        path: "/app/add-notfication",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Send Notfication ",
      },
      {
        path: "/app/Send-bulk-notfication",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Send Bulk Notfication ",
      },
      {
        path: "/app/all-notfication",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "All Notfication ",
      },
      {
        path: "/app/send-single-email",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Send Email ",
      },
      {
        path: "/app/send-bulk-email",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Send Bulk Email ",
      },
      {
        path: "/app/send-emails",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "All Emails ",
      },
      {
        path: "/app/send-single-message",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Send SMS ",
      },
      {
        path: "/app/send-bulk-sms",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Send Bulk SMS ",
      },
      {
        path: "/app/view-sms",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "All SMS ",
      },
      {
        path: "/app/add-letter-type",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Letter Type ",
      },
      {
        path: "/app/view-letter-types",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Letter Types",
      },
      {
        path: "/app/send-letter",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Send Letter",
      },

      {
        path: "/app/all-sent-letters",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Sent Letters",
      },
    ],
  },
  //report
  {
    path: "",

    icon: <ClipboardDocumentListIcon className={`${iconClasses} inline`} />,
    name: "Reports",
    submenu: [
      {
        path: "/app/govt-bill-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Govt Bill Report",
      },
      {
        path: "/app/tenant-bill-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Tenant Bill Report",
      },
      {
        path: "/app/tenant-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Tenant Report",
      },
      {
        path: "/app/expense-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Expense Report",
      },

      {
        path: "/app/purchase-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Purchase Report",
      },
      {
        path: "/app/charging-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Charging Report",
      },
      {
        path: "/app/maintenance-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Maintenance Report",
      },
      {
        path: "/app/return-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Return Report",
      },
      {
        path: "/app/payment-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Payment Report",
      },
      {
        path: "/app/item-assignment-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Item Assignment Report",
      },
      {
        path: "/app/view-revenue-report",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Revenue Report",
      },
    ],
  },
  {
    path: "",
    icon: <CogIcon className={`${iconClasses} inline`} />,
    name: "Settings",
    submenu: [
      {
        path: "/app/add-setting",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Setting ",
      },
      {
        path: "/app/view-settings",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View ",
      },
      {
        path: "/app/add-role",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Role ",
      },
      {
        path: "/app/view-role",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Roles",
      },
      {
        path: "/app/add-permission",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Permission ",
      },
      {
        path: "/app/view-permission",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Permissions",
      },
      {
        path: "/app/assign-permission",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Assign Permissions  ",
      },
      {
        path: "/app/revoke-permission",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "Revoke Permissions",
      },
      {
        path: "/app/calendar-settings",
        icon: <CogIcon className={submenuIconClasses} />,
        name: "Calendar Settings",
      },
      {
        path: "/app/apply-punishment",
        icon: <CogIcon className={submenuIconClasses} />,
        name: "Apply Punishment   ",
      },
      {
        path: "/app/add-account",
        icon: <PlusIcon className={submenuIconClasses} />,
        name: "Add Account   ",
      },
      {
        path: "/app/view-payment-setting",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Accounts   ",
      },
      {
        path: "/app/gallery",
        icon: <EyeIcon className={submenuIconClasses} />,
        name: "View Gallery   ",
      },
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
      routes = adminRoutes; // full sidebar
    } else if (role === "tenant") {
      routes = tenantRoutes;
    } else {
      routes = [...employeeRoutes];

      for (const module of adminRoutes) {
        if (!module.name) continue;

        const hasPermission = permissions.some((perm) =>
          perm.toLowerCase().includes(module.name.toLowerCase()),
        );

        if (hasPermission) {
          // ✅ add module to sidebar
          routes.push(module);
        }
      }
    }
  } catch (error) {
    console.error("Token decode failed", error);
  }
}

export default routes;
