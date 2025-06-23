import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import TenantPaymentRequestsPage from '../../../features/payment-request/tenantViewRequest';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: " " }));
  }, []);

  return <TenantPaymentRequestsPage />;
}

export default InternalPage;
