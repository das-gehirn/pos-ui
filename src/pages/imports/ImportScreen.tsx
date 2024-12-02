import FileDropzone from "@/components/FileDropzone";
import PrimaryButton from "@/components/PrimaryButton";
import SelectField from "@/components/customFields/Select/SelectField";
import { HandlerProps } from "@/components/customFields/type";
import DashboardLayout from "@/components/dashboard/Layout";
import PageContainer from "@/components/dashboard/PageContainer";
import { Button } from "@/components/ui/button";
import { SERVICES_OPTIONS } from "@/utils";
import { useState } from "react";

const ImportsScreen = () => {
  const [service, setService] = useState("");

  const handleFormFieldChange = (data: HandlerProps) => {
    setService(data.value);
  };
  return (
    <DashboardLayout pageTitle="Imports">
      <PageContainer>
        <div className="md:w-1/2 m-auto">
          {service && (
            <div className="flex items-end justify-end">
              <Button variant={"ghost"} className="hover:bg-transparent underline">
                Download Template
              </Button>
            </div>
          )}
          <SelectField
            options={SERVICES_OPTIONS}
            fieldKey="service"
            onChange={handleFormFieldChange}
            label="Service"
            selectValue={service}
          />
          <FileDropzone onChange={() => {}} allowedFileExtensions={["xlsx"]} />

          <div className="flex items-end justify-end">
            <PrimaryButton className="w-48" text="Import" />
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

export default ImportsScreen;
