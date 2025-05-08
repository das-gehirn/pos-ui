import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { PermissionResource, permissionOperations, PermissionOperation } from "@/helpers/permission";
import CheckBoxField from "../combo/CheckBoxField";
import { capitalize, get, isEqual, startCase } from "lodash";
import { HandlerProps } from "../type";
import { DeepOptional } from "@/interfaces";

const Permission = ({
  permissionResources,
  userPermission,
  fieldKey,
  onChange,
  disabled
}: {
  permissionResources: PermissionResource[];
  userPermission: DeepOptional<{
    [key in PermissionResource]: PermissionOperation[];
  }>;
  fieldKey: string;
  disabled?: boolean;
  onChange: (data: {
    key: string;
    value: DeepOptional<{
      [key in PermissionResource]: PermissionOperation[];
    }>;
  }) => void;
}) => {
  const [permissions, setPermissions] = useState<
    DeepOptional<{
      [key in PermissionResource]: PermissionOperation[];
    }>
  >({});

  const [checkAll, setCheckAll] = useState(false);

  const handleTogglePermission = useCallback(
    (permission: PermissionResource, operation: PermissionOperation) => {
      setPermissions((prevPermissions) => {
        const currentPermissions = (prevPermissions?.[permission] || []) as PermissionOperation[];

        const updatedPermissions = currentPermissions.includes(operation)
          ? currentPermissions.filter((op) => op !== operation)
          : [...currentPermissions, operation];

        const newPermissions = { ...prevPermissions };

        if (updatedPermissions.length > 0) {
          newPermissions[permission] = updatedPermissions;
        } else {
          delete newPermissions[permission];
        }

        onChange({ key: fieldKey, value: newPermissions });

        return newPermissions as { [key in PermissionResource]?: PermissionOperation[] };
      });
    },
    [fieldKey, onChange]
  );
  const handleCheckAllPermissions = useCallback(
    (data: HandlerProps) => {
      if (data.value) {
        const result = permissionResources.reduce((acc: any, permission) => {
          acc[permission] = permissionOperations;
          return acc;
        }, {});
        setPermissions(result);
      } else {
        setPermissions({});
      }
      setCheckAll(data.value);
    },
    [permissionResources]
  );

  useEffect(() => {
    if (permissions) {
      onChange({ key: fieldKey, value: permissions || {} });
    }
  }, [permissions]);

  const formatPermissionResource = useCallback((resource: string) => {
    const spacedStr = resource.replace(/([A-Z])/g, " $1");
    return startCase(spacedStr.trim());
  }, []);

  useMemo(() => {
    if (userPermission) {
      if (!isEqual(userPermission, permissions)) {
        setPermissions(userPermission);
      }
    }
  }, [userPermission, fieldKey]);

  return (
    <div className="flex flex-col dark:text-dark_text-300">
      <div className="mb-5 flex items-center gap-4">
        <p>Check all permissions</p>
        <CheckBoxField
          handleFieldChange={handleCheckAllPermissions}
          className="w-[20px] h-[20px]"
          disabled={disabled}
          fieldKey="checkAll"
          value={checkAll}
          checked={checkAll}
        />
      </div>

      <div className="flex items-end justify-between">
        <p className="flex-1 font-bold">Permissions</p>
        <div className="flex flex-1 justify-between items-center gap-3">
          {permissionOperations.map((operation) => (
            <p key={operation} className="text-sm">
              {capitalize(operation)}
            </p>
          ))}
        </div>
      </div>
      <div className="my-5">
        {permissionResources.map((permission) => (
          <div className="flex gap-10 justify-between items-center overflow-x-auto" key={permission}>
            <p className="flex-1 mb-2 pb-1">{formatPermissionResource(permission)}</p>
            <div className="flex items-center justify-between flex-1 gap-4">
              {permissionOperations.map((operation, index) => {
                const permissionObj = get(permissions, permission, "") || [];
                return (
                  <CheckBoxField
                    key={index}
                    checked={Boolean(permissionObj.length > 0 && permissionObj.includes(operation))}
                    handleFieldChange={() => handleTogglePermission(permission, operation)}
                    className="w-[20px] h-[20px]"
                    disabled={disabled}
                    fieldKey={fieldKey}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Permission);
