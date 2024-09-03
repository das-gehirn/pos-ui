import DashboardLayout from "@/components/dashboard/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { InvoiceProps } from "@/interfaces/invoice";
import { FileText, Send, SquarePen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BillingAddress from "./components/BillingAddress";
import InvoiceItemHeader from "./components/InvoiceItemHeader";
import InvoiceItem from "./components/InvoiceItem";
import InvoiceSummary from "./components/InvoiceSummary";
import { computeInvoiceAmounts } from "@/utils";
import { startCase } from "lodash";
import { formatCurrency } from "@/helpers";
import { format } from "date-fns";

const InvoiceDetailsScreen = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const id = params.id;

  const { data, isFetching } = useGeneralQuery<InvoiceProps>({
    queryKey: ["invoices", id],
    url: `/invoices/${id}`,
    enabled: true,
    requireAuth: true
  });

  const { invoiceDiscountTotal, invoiceSubTotal, invoiceTotal } = computeInvoiceAmounts({
    items: data?.items || [],
    discount: data?.discount
  });

  const invoiceStatusColors: Record<string, any> = {
    "not paid": "destructive",
    paid: "default",
    "partly paid": "secondary",
    expired: "outline"
  };

  const editInvoiceHandler = () => {
    navigate(`/invoices/${id}/edit`);
  };

  return (
    <DashboardLayout pageTitle="Invoice Details" isLoading={isFetching}>
      <div className="invoice-header lg:flex items-end justify-between border-b pb-3">
        <div className="heading_text md:w-[65%]">
          <div>
            <div className="flex gap-x-5">
              <h1 className="font-medium text-2xl mb-2">INV-101010</h1>
              <div>
                <Badge variant={invoiceStatusColors[data?.status || "not paid"]}>{startCase(data?.status)}</Badge>
              </div>
            </div>
            <p className="text-sm flex gap-x-5">
              <span className="font-medium">
                {formatCurrency({ value: invoiceTotal, showCurrencySign: false })}{" "}
                <span className="text-gray-500 ml-1.5">GHS</span>
              </span>
              <li className="text-gray-500 font-light">
                Issued at {data?.invoiceDate && format(data?.invoiceDate, "do LLL y")}
              </li>
              <li className="text-gray-500 font-light">Due at {data?.dueDate && format(data?.dueDate, "do LLL y")}</li>
            </p>
          </div>
        </div>
        <div className="md:w-[35%] heading_actions flex gap-x-3 items-center md:gap-x-2 md:mt-4 lg:mt-0">
          <Button className="flex h-8 gap-x-2" variant={"outline"} disabled>
            <FileText size={16} />
            <span>Print</span>
          </Button>
          <Button className="flex h-8 gap-x-2" variant={"outline"} disabled>
            <Send size={16} />
            <span>Send Invoice</span>
          </Button>
          {data?.status !== "paid" && (
            <Button className="flex h-8 gap-x-2" variant={"outline"} onClick={editInvoiceHandler}>
              <SquarePen size={16} />
              <span>Edit Invoice</span>
            </Button>
          )}
        </div>
      </div>

      <div className="invoice-content my-5 lg:flex justify-between gap-x-10">
        <div className="lg:w-[60%] px-4 py-8 bg-white rounded shadow-sm">
          <h1 className="text-xl font-medium border-b pb-2">Invoice Batch 2023</h1>
          <div className="md:flex items-center justify-between relative py-4">
            <BillingAddress
              address={{ poBox: "P.O BOX 34", state: "Ekwamkurom", city: "Agona Swdru" }}
              email="admin@oseikrom.com"
              name="Oseikrom Hardware Enterprise"
              phone={{ number: "543814868", country: "GH", prefix: "233" }}
              type="from"
              showEditAddress={false}
            />
            <div className="absolute md:border-r h-full bg-red-50 left-1/2 mt-4"></div>
            <BillingAddress
              address={data?.customerData?.address || {}}
              email={data?.customerData?.email || ""}
              name={`${data?.customerData?.firstName || "N/A"} ${data?.customerData?.lastName || "N/A"}`}
              phone={data?.customerData?.phone}
              type="to"
              showEditAddress={false}
            />
          </div>

          <div className="items-container my-10 border py-5 px-10 space-y-5">
            <InvoiceItemHeader />
            {data?.items &&
              data?.items.length > 0 &&
              data.items.map((item) => {
                return (
                  <InvoiceItem
                    item={{ amount: item.price, name: item.name || "", quantity: item.quantity }}
                    key={item._id}
                    id={item._id || ""}
                    showDelete={false}
                  />
                );
              })}
          </div>
          <InvoiceSummary
            discount={data?.discount}
            invoiceDiscountTotal={invoiceDiscountTotal}
            invoiceSubTotal={invoiceSubTotal}
          />
          <div className="terms  text-wrap space-y-3">
            <h1 className="font-medium">Terms & Conditions</h1>
            <p className="text-sm">{data?.termsAndCondition}</p>
          </div>
        </div>
        <div className="lg:w-[40%]">
          <div className="notes_container px-4 py-8 space-y-4">
            <div className="notes">
              <h1 className="font-medium">Notes</h1>
            </div>
            {data?.note && <p className="border rounded bg-white pt-3 pb-8 px-3 text-sm">{data?.note}</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvoiceDetailsScreen;
