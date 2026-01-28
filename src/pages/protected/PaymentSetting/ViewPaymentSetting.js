import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import PaymentSettings from '../../../features/payment-setting/getPaymentSetting';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: " " }));
  }, []);

  return <PaymentSettings />;
}

export default InternalPage;
