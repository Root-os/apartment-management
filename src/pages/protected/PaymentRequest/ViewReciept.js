import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import PaymentReceiptPage from '../../../features/payment-request/reciept';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: " " }));
  }, []);

  return <PaymentReceiptPage />;
}

export default InternalPage;
