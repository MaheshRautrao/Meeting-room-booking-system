"use client";
import { DataTable } from "@/components/data-table";
import { useState, useEffect } from "react";
import { AddUserDialog } from "./add-user-dialog";
import { userColumns } from "@/datatable/users";
import { toast } from "sonner";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, [success]);

  const handleSuccess = () => {
    setSuccess((prev) => !prev); // Toggle the success state to trigger refetch
    toast.success("User created successfully");
  };

  return (
    <div className="p-10">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="text-xl">Users Configuration</div>
          <div>
            <AddUserDialog onSuccess={handleSuccess} />
          </div>
        </div>
        <div>
          <DataTable columns={userColumns} data={users} />
        </div>
      </div>
    </div>
  );
}
