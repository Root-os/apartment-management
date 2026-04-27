import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import AddTenantRent from '../../../features/rent-collection/tenantCreateRent';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: " " }));
  }, []);

  return <AddTenantRent />;
}

export default InternalPage;