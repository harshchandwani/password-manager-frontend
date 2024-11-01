"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Delete, DeleteIcon, Edit, OctagonX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PasswordEntry = {
  id: string;
  websiteName: string;
  username: string;
  password: string;
};

const DashboardPage: React.FC = () => {
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchPasswords();
  }, [router]);

  const fetchPasswords = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/passwords`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the token with the request
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPasswords(data); // Set the retrieved passwords
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          description: "Failed to load passwords.",
        });
        setError(errorData.error || "Failed to load passwords.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("Failed to load passwords due to an error.");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    toast({
      description: "Logout Successful",
    });
    router.push("/login"); // Redirect to login page
  };
  const deletePassword = async (id: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/passwords/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the token with the request
          },
        }
      );

      if (response.ok) {
        toast({
          variant: "destructive",
          description: "Password Deleted Successfully",
        });
        fetchPasswords();
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          description: "Failed to delete password",
        });
        setError(errorData.error || "Failed to delete password.");
        router.push("/login");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete password due to an error.",
      });
      setError("Failed to delete password due to an error.");
      router.push("/login");
    }
  };

  const columns: ColumnDef<PasswordEntry>[] = [
    {
      accessorKey: "websiteName",
      header: "Website Name",
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span>{row.getValue("username")}</span>
          <button
            onClick={() =>
              navigator.clipboard.writeText(row.getValue("username"))
            }
            className="ml-1"
          >
            <Copy width={15} height={15} />
          </button>
        </div>
      ),
    },
    {
      accessorKey: "password",
      header: "Password",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span>{row.getValue("password")}</span>
          <button
            onClick={() =>
              navigator.clipboard.writeText(row.getValue("password"))
            }
            className="ml-1"
          >
            <Copy width={15} height={15} />
          </button>
        </div>
      ),
    },
    {
      accessorKey: "edit",
      header: "Edit",
      cell: ({ row }) => (
        <button
          className="px-3 py-1 rounded cursor-not-allowed"
          title="Edit feature coming soon"
          disabled
        >
          <Edit width={15} height={15} />
        </button>
      ),
    },
    {
      id: "delete",
      header: "Delete",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => deletePassword(row.original.id)}
            className="px-3 py-1 rounded"
          >
            <OctagonX width={15} height={15} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: passwords,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Passwords</h1>
        <div className="flex space-x-4">
          <Button onClick={() => router.push("/add-password")}>
            Add New Password
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* For Seach */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter websites..."
          value={
            (table.getColumn("websiteName")?.getFilterValue() as string) ?? ""
          }
          onChange={e =>
            table.getColumn("websiteName")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No passwords available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end py-4 ">
        <Button
          className="mr-2"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
