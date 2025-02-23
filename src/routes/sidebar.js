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


import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'




const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [

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
    icon: <WalletIcon className={`${iconClasses} inline` }/>, 
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
        name: 'Expenses ',
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
    icon: <WalletIcon className={`${iconClasses} inline` }/>, 
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
]

export default routes


