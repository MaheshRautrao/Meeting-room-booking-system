"use client";
import { DataTable } from "@/components/data-table";
import { useState, useEffect } from "react";
import { AddUserDialog } from "./add-user-dialog";
import { userColumns } from "@/datatable/users";
import { toast } from "sonner";
import { Loader } from "@/components/common/loader";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [error, setError] = useState(""); // ✅ Error state
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/users");

        if (!res.ok) {
          throw new Error("Failed to fetch users.");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
        toast.error(err.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [success]);

  const handleSuccess = () => {
    setSuccess((prev) => !prev); // Toggle the success state to trigger refetch
  };

  return (
    <div className="p-10">
      <div className="flex flex-col gap-5">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">Users Configuration</div>
          <div>
            <AddUserDialog onSuccess={handleSuccess} />
          </div>
        </div>

        {/* Data Section */}
        <div>
          {loading ? (
            // ✅ Beautiful Loader
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          ) : error ? (
            // ✅ Error State
            <div className="text-red-500 text-center py-6">{error}</div>
          ) : users.length === 0 ? (
            // ✅ No Data State
            <div className="text-gray-500 text-center py-6">
              No users available.
            </div>
          ) : (
            // ✅ Render DataTable
            <DataTable columns={userColumns} data={users} />
          )}
        </div>
      </div>
    </div>
  );
}
