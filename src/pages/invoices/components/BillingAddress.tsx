import { formatAddressToString, formatPhoneToString } from "@/helpers";
import { AddressProps, PhoneProps } from "@/interfaces";
import { PencilLine } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";

interface BillingAddressProps {
  type: "from" | "to";
  address?: AddressProps;
  phone?: PhoneProps;
  email: string;
  name: string;
  showEditAddress?: boolean;
  editAddressURL?: string;
}
const BillingAddress: FC<BillingAddressProps> = ({
  address,
  email,
  phone,
  type,
  name,
  showEditAddress = true,
  editAddressURL
}) => {
  return (
    <div className="relative">
      <p className="text-gray-500 text-sm">{type === "from" ? "BILLING FROM" : "BILLING TO"}</p>
      <h1 className="text-2x font-medium">{name}</h1>
      <span className="text-xs">{email}</span>
      <div className="my-7 text-sm">
        {address && formatAddressToString(address)}
        {type === "from" && "C0-0056-0664 Gomoa Ekwamkrom Police Barrier"}
        <p>{formatPhoneToString(phone)}</p>
        {showEditAddress && (
          <Link to={editAddressURL || ""} className="font-bold text-primary my-3 flex items-center gap-x-1">
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
