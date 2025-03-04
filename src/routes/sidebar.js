/** Icons are imported separatly to reduce build time */
import BellIcon from '@heroicons/react/24/outline/BellIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'
import CodeBracketSquareIcon from '@heroicons/react/24/outline/CodeBracketSquareIcon'
import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon'
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon'
import ArrowDownIcon from '@heroicons/react/24/outline/ArrowDownIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon'
import BoltIcon from '@heroicons/react/24/outline/BoltIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import KeyIcon from '@heroicons/react/24/outline/KeyIcon'
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon'
import FlagIcon from '@heroicons/react/24/outline/FlagIcon'
import TagIcon from '@heroicons/react/24/outline/TagIcon'
import BookOpenIcon from '@heroicons/react/24/outline/BookOpenIcon'
import QuestionMarkCircleIcon from '@heroicons/react/24/outline/QuestionMarkCircleIcon'
import CalendarIcon from '@heroicons/react/24/outline/CalendarIcon'
import {HomeIcon,BuildingOffice2Icon} from '@heroicons/react/24/outline'
import ServerIcon from '@heroicons/react/24/outline/ServerIcon'
import ClipboardDocumentListIcon from '@heroicons/react/24/outline/ClipboardDocumentListIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import BriefcaseIcon from '@heroicons/react/24/outline/BriefcaseIcon'
import GlobeAltIcon from '@heroicons/react/24/outline/GlobeAltIcon'
import FilmIcon from '@heroicons/react/24/outline/FilmIcon'
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon'
import CubeIcon from '@heroicons/react/24/outline/CubeIcon'
import PaperClipIcon from '@heroicons/react/24/outline/PaperClipIcon'
import CogIcon from '@heroicons/react/24/outline/CogIcon'
import EnvelopeIcon from '@heroicons/react/24/outline/EnvelopeIcon'
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon as MailIcon } from '@heroicons/react/24/outline';



import ClipboardIcon from '@heroicons/react/24/outline/ClipboardIcon'
import ShoppingBagIcon from '@heroicons/react/24/outline/ShoppingBagIcon'
import WrenchIcon from '@heroicons/react/24/outline/WrenchIcon'
import ExclamationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon'
import MapPinIcon from '@heroicons/react/24/outline/MapPinIcon'
import ArrowUpIcon from '@heroicons/react/24/outline/ArrowUpIcon'
import PowerIcon from '@heroicons/react/24/outline/PowerIcon'




import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'




const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const role=localStorage.getItem('role')
const routes = role==='tenant' ?
[
  {
    path: '/app',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'tenant-Dashboard',  
  },
  
  //complain
  {
    path: '', 
    icon: <EnvelopeIcon className={`${iconClasses} inline` }/>, 
    name: 'Tenant Complain',  
    submenu : [
     
     {
      path: '/app/complain-tenant-add',
      icon: <PlusIcon className={submenuIconClasses}/>,
      name: 'Add Complaint',
    },
    {
      path: '/app/complain-tenant-view',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'My complaints',
    },
    ]
  },
  {
    path: '', 
    icon: <ArrowUpIcon className={`${iconClasses} inline` }/>, 
    name: 'Withdraw Request',  
    submenu : [
     
     {
      path: '/app/withdraw-request-add',
      icon: <PlusIcon className={submenuIconClasses}/>,
      name: 'Add Request',
    },
    {
      path: '/app/withdraw-request-view',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'My Requests',
    },
    ]
  },
]:

//admin side
[

  {
    path: '/app',
    icon: <Squares2X2Icon className={iconClasses}/>, 

    name: 'Dashboard',  

  },
  // {
  //   path: '', 
  //   icon: <DocumentDuplicateIcon className={`${iconClasses} inline` }/>, 
  //   name: 'Pages', 
  //   submenu : [
  //     {
  //       path: '/login',
  //       icon: <ArrowRightOnRectangleIcon className={submenuIconClasses}/>,
  //       name: 'Login',
  //     },
  //     {
  //       path: '/register', 
  //       icon: <UserIcon className={submenuIconClasses}/>, 
  //       name: 'Register',
  //     },
  //     {
  //       path: '/forgot-password',
  //       icon: <KeyIcon className={submenuIconClasses}/>,
  //       name: 'Forgot Password',
  //     },
  //     {
  //       path: '/app/blank',
  //       icon: <DocumentIcon className={submenuIconClasses}/>,
  //       name: 'Blank Page',
  //     },
  //     {
  //       path: '/app/404',
  //       icon: <ExclamationTriangleIcon className={submenuIconClasses}/>,
  //       name: '404',
  //     },
  //   ]
  // },
  // {
  //   path: '', 
  //   icon: <Cog6ToothIcon className={`${iconClasses} inline` }/>,
  //   name: 'Settings', 
  //   submenu : [
  //     {
  //       path: '/app/settings-profile', 
  //       icon: <UserIcon className={submenuIconClasses}/>,
  //       name: 'Profile', 
  //     },
  //    
  //    
  //   ]
  // },
  //
  

  {
    path: '', 
    icon: <HomeIcon className={`${iconClasses} inline` }/>, 
    name: 'Floor', 
    submenu : [
      {
        path: '/app/floor-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Floor Info',
      },
      {
        path: '/app/floor-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'Floor Lists',
      },
    ]
  },
  {
    path: '', 
    icon: <BuildingOffice2Icon className={`${iconClasses} inline` }/>, 
    name: 'Unit', 
    submenu : [
      {
        path: '/app/unit-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add unit Info',
      },
      {
        path: '/app/unit-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'Unit Lists',
      },
    ]
  },
  {
    path: '', 
    icon: <DocumentDuplicateIcon className={`${iconClasses} inline` }/>, 
    name: 'Bill Type ', 
    submenu : [
      {
        path: '/app/bill-type-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Bill Payment',
      },
      {
        path: '/app/bill-type-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'Bill Payments',
      },
    ]
  },
  {
    path: '', 
    icon: <DocumentDuplicateIcon className={`${iconClasses} inline` }/>, 
    name: 'Bill Payment for Gov.t', 
    submenu : [
      {
        path: '/app/payment-goverment-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Bill Payment',
      },
      {
        path: '/app/payment-goverment-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'Payments for gov.t ',
      },
    ]
  },
  {
    path: '', 
    icon: <CreditCardIcon className={`${iconClasses} inline` }/>, 
    name: 'Expense', 
    submenu : [
      {
        path: '/app/expense-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Expense',
      },
      {
        path: '/app/expense-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'Expense ',
      },
    ]
  },
  {
    path: '', 
    icon: <CreditCardIcon className={`${iconClasses} inline` }/>, 
    name: 'Expense Type', 
    submenu : [
      {
        path: '/app/expense-type-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Expense Type',
      },
      {
        path: '/app/expense-type-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'Expense Types ',
      },
    ]
  },
  {
    path: '', 
    icon: <UserIcon className={`${iconClasses} inline` }/>, 
    name: 'Tenant', 
    submenu : [
      {
        path: '/app/tenant-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Tenant info',
      },
      {
        path: '/app/tenant-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'Tenants ',
      },
    ]
  },
  {
    path: '', 
    icon: <WalletIcon className={`${iconClasses} inline` }/>, 
    name: 'Bills Paid by Tenant', 
    submenu : [
      {
        path: '/app/tenant-bill-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Tenant Bills',
      },
      {
        path: '/app/tenant-bill-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'Tenant Bills ',
      },
    ]
  },
  {
    path: '', 
    icon: <WalletIcon className={`${iconClasses} inline` }/>, 
    name: 'Rent collection', 
    submenu : [
      {
        path: '/app/rent-collection-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Collected Rent',
      },
      {
        path: '/app/rent-collection-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'Collected Rents ',
      },
    ]
  },
  {
    path: '', 

    icon: <MapPinIcon className={`${iconClasses} inline` }/>, 

    name: 'Parking', 
    submenu : [
      {
        path: '/app/parking-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Parking Info',
      },
      {
        path: '/app/parking-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'Parking Informations ',
      },
    ]
  },
  {
    path: '', 
    icon: <CubeIcon className={`${iconClasses} inline` }/>, 
    name: 'Inventory Item Types', 
    submenu : [
      {
        path: '/app/item-type-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Item Type',
      },
      {
        path: '/app/item-type-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'View Item Type',
      },
    ]
  },
  {
    path: '', 
    icon: <CubeIcon className={`${iconClasses} inline` }/>, 
    name: 'Inventory Item', 
    submenu : [
      {
        path: '/app/item-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Item ',
      },
      {
        path: '/app/item-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'View Items',
      },
    ]
  },
  {
    path: '', 
    icon: <PaperClipIcon className={`${iconClasses} inline` }/>, 
    name: 'Payment Request', 
    submenu : [
      {
        path: '/app/payment-request-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Payment Request',
      },
      {
        path: '/app/payment-request-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'View Payment Request',
      },
    ]
  },
  {
    path: '', 
    icon: <BellIcon className={`${iconClasses} inline` }/>, 
    name: 'Notfication Type', 
    submenu : [
      {
        path: '/app/notfication-type-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Notfication Type',
      },
      {
        path: '/app/notfication-type-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'View Notfication Type',  
      },
    ]
  },
  {
    path: '', 

    icon: <PowerIcon className={`${iconClasses} inline` }/>, 

    name: 'Charging', 
    submenu : [
      {
        path: '/app/charging-add',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Charging',
      },
      {
        path: '/app/charging-view',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'View Charging Info',  
      },
    ]
  },
  {
    path: '', 
    icon: <CogIcon className={`${iconClasses} inline` }/>, 
    name: 'Settings', 
    submenu : [
      {

        path: '/app/add-setting',
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Add Setting ',
      },
      {
        path: '/app/view-settings',
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'View ',
      },
    ]
  },
  {
    path: '', 
    icon: <BellIcon className={`${iconClasses} inline` }/>, 
    name: 'Notfication', 
    submenu : [
      {
        path:"/app/add-notfication",
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Send Notfication ',
      },
      {
        path:"/app/Send-bulk-notfication",
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Send Bulk Notfication ',
      },
      {
        path:"/app/all-notfication",
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'All Notfication ',
      }

     
    ]
  },
  {
    path: '', 
    icon: <EnvelopeIcon className={`${iconClasses} inline` }/>, 
    name: 'Email', 
    submenu : [
      {
        path:"/app/send-single-email",
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Send Email ',
      },
      {
        path:"/app/send-bulk-email",
        icon: <PlusIcon className={submenuIconClasses}/>,
        name: 'Send Bulk Email ',
      },
      {
        path:"/app/send-emails",
        icon: <EyeIcon className={submenuIconClasses}/>,
        name: 'All Emails ',
      }
    ]
  },


  //report
  {
    path: '', 

    icon: <ClipboardDocumentListIcon className={`${iconClasses} inline` }/>, 
    name: 'Reports',  
    submenu : [
     
     {
      path: '/app/govt-bill-report',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Govt Bill Report',
    },
    {
      path: '/app/tenant-bill-report',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Tenant Bill Report',
    },
    {
      path: '/app/tenant-report',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Tenant Report',
    },
    {
      path: '/app/expense-report',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Expense Report',
    },

{
      path: '/app/purchase-report',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Purchase Report',
    },
    {
      path: '/app/charging-report',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Charging Report',
    },
    {
      path: '/app/maintenance-report',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Maintenance Report',
    },
    {
      path: '/app/return-report',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Return Report',
    },
    {
      path: '/app/payment-report',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Payment Report',
    },

    ]
  },
  //complain
  {
    path: '', 
    icon: <ExclamationCircleIcon className={`${iconClasses} inline` }/>, 
    name: 'Complain from tenant',  
    submenu : [
     
     {
      path: '/app/complain-fromT-view',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'View Complaints',
    },
    {
      path: '/app/admin-view-assigneds',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Assigned Staff',
    },
    ]
  },
  {
    path: '', 
    icon: <ArrowUpIcon className={`${iconClasses} inline` }/>, 
    name: 'Withdrawal requests from tenant',  
    submenu : [
     
     {
      path: '/app/view-withdraw-requests',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'View Requests',
    },
    ]
  },
  //purchase
  {
    path: '', 
    icon: <CreditCardIcon className={`${iconClasses} inline` }/>, 
    name: 'Purchase',  
    submenu : [
     
     {
      path: '/app/add-purchase',
      icon: <PlusIcon className={submenuIconClasses}/>,
      name: 'Add Purchase',
    },
    {
      path: '/app/view-purchase',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Purchases ',
    },
    ]
  },
  {
    path: '', 
    icon: <ShoppingBagIcon className={`${iconClasses} inline` }/>, 
    name: 'Purchase Request',  
    submenu : [
     
     {
      path: '/app/add-purchase-request',
      icon: <PlusIcon className={submenuIconClasses}/>,
      name: 'Add Purchase Request',
    },
    {
      path: '/app/view-purchase-request',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Purchase requests ',
    },
    ]
  },
  {
    path: '', 
    icon: <WrenchIcon className={`${iconClasses} inline` }/>, 
    name: 'Maintenance ',  
    submenu : [
     
     {
      path: '/app/add-maintenance',
      icon: <PlusIcon className={submenuIconClasses}/>,
      name: 'Add Maintenance',
    },
    {
      path: '/app/view-maintenance',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'View Maintenance info ',
    },
    ]
  },
  {
    path: '', 
    icon: <ClipboardIcon className={`${iconClasses} inline` }/>, 
    name: 'item-assignments',  
    submenu : [
     
     {
      path: '/app/add-item-assignments',
      icon: <PlusIcon className={submenuIconClasses}/>,
      name: 'Add Item',
    },
    {
      path: '/app/view-item-assignments',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'View Item Assignments',
    },

    ]
  },

  //Service Type
  {
    path: '', 
    icon: <CalendarIcon className={`${iconClasses} inline` }/>, 
    name: 'Service Type',  
    submenu : [
     
     {
      path: '/app/add-service-type',
      icon: <PlusIcon className={submenuIconClasses}/>,
      name: 'Service Type Add',
    },
    {
      path: '/app/view-service-types',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Service Type',
    },
    ]
  },

  //vendor
  {
    path: '', 
    icon: <BuildingOfficeIcon className={`${iconClasses} inline` }/>, 
    name: 'Vendor',  
    submenu : [
     
     {
      path: '/app/add-vendor',
      icon: <PlusIcon className={submenuIconClasses}/>,
      name: 'Vendor Add',
    },
    {
      path: '/app/view-vendors',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Vendors',
    },
    ]
  },

  //return
  { 
    path: '', 
    icon: <ArrowDownIcon className={`${iconClasses} inline` }/>, 
    name: 'Return',  
    submenu : [
     
     {
      path: '/app/add-return',
      icon: <PlusIcon className={submenuIconClasses}/>,
      name: 'Return Add',
    },
    {
      path: '/app/view-returns',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Returns',
    },
    ]
  },


  //payment
  {
    path: '', 
    icon: <CreditCardIcon className={`${iconClasses} inline` }/>, 
    name: 'Payment',  
    submenu : [
     
     {
      path: '/app/add-payment',
      icon: <PlusIcon className={submenuIconClasses}/>,
      name: 'Payment Add',
    },
    {
      path: '/app/view-payments',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Payments',
    },
    ]
  },

  //letter
  {
    path: '', 
    icon: <MailIcon className={`${iconClasses} inline` }/>, 
    name: 'Letter',  
    submenu : [
     
     {
      path: '/app/add-letter-type',
      icon: <PlusIcon className={submenuIconClasses}/>,
      name: 'Letter Type Add',
    },
    {
      path: '/app/send-letter',
      icon: <PlusIcon className={submenuIconClasses}/>,
      name: 'Send Letter',
    },
    {
      path: '/app/view-letter-types',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Letter Types',
    },
    {
      path: '/app/all-sent-letters',
      icon: <EyeIcon className={submenuIconClasses}/>,
      name: 'Sent Letters',
    }
    ]
  }

  

  
]

export default routes

