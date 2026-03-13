import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import TenantPaymentVerificationPage from '../../../features/payment-request/requestTenantLink';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: " " }));
  });

  return <TenantPaymentVerificationPage />;
}

export default InternalPage;
