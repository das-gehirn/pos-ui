import { formatPhoneToString } from "@/helpers";
import { AddressProps, PhoneProps } from "@/interfaces";
import { PencilLine } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";

interface BillingAddressProps {
  type: "from" | "to";
  address: AddressProps;
  phone?: PhoneProps;
  email: string;
  name: string;
}
const BillingAddress: FC<BillingAddressProps> = ({ address, email, phone, type, name }) => {
  return (
    <div className="relative">
      <p className="text-gray-500 text-sm">{type === "from" ? "BILLING FROM" : "BILLING TO"}</p>
      <h1 className="text-2x font-medium">{name}</h1>
      <span className="text-xs">{email}</span>
      <div className="my-7 text-sm">
        <p>{address?.poBox}</p>
        <p>{address?.state}</p>
        <p>{formatPhoneToString(phone)}</p>
        {false && (
          <Link to="" className="font-bold text-primary my-3 flex items-center gap-x-1">
            <span>
              <PencilLine size={18} />
            </span>
            <span>Edit Info</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BillingAddress;
