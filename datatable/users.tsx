import { ColumnDef } from "@tanstack/react-table";

export type User = {
  id: string;
  name: string;
  employeeCode: string;
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "employeeCode",
    header: "Employee Code",
  },
];
