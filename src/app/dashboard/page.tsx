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
import { Copy, OctagonX, Edit } from "lucide-react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPasswordId, setSelectedPasswordId] = useState<string | null>(
    null
  );
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchPasswords();
  }, [router]);

  const fetchPasswords = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/passwords`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPasswords(data);
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
    localStorage.removeItem("token");
    router.push("/login");
    toast({
      description: "Logout Successful",
    });
  };

  const deletePassword = async (id: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/passwords/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          description: "Copied to clipboard!",
        });
      },
      () => {
        toast({
          variant: "destructive",
          description: "Failed to copy to clipboard.",
        });
      }
    );
  };
  const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white text-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this password?</p>
          <div className="mt-4 flex justify-end space-x-4">
            <Button variant="destructive" onClick={onConfirm}>
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  };
  const handleConfirmDelete = () => {
    if (selectedPasswordId) {
      deletePassword(selectedPasswordId);
      setSelectedPasswordId(null);
    }
    setIsModalOpen(false);
  };

  const columns: ColumnDef<PasswordEntry>[] = [
    {
      accessorKey: "websiteName",
      header: "Website Name",
    },
    {
      accessorKey: "website",
      header: "Website URL",
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <div
          className="flex items-center relative cursor-pointer group"
          onClick={() => handleCopy(row.getValue("username"))}
          title="Click to copy"
        >
          <span>{row.getValue("username")}</span>
          <Copy width={15} height={15} className="ml-1" />
        </div>
      ),
    },
    {
      accessorKey: "password",
      header: "Password",
      cell: ({ row }) => (
        <div
          className="flex items-center relative cursor-pointer group"
          onClick={() => handleCopy(row.getValue("password"))}
          title="Click to copy"
        >
          <span className="blur-sm group-hover:blur-none transition duration-200">
            {row.getValue("password")}
          </span>
          <Copy width={15} height={15} className="ml-1" />
        </div>
      ),
    },
    {
      accessorKey: "edit",
      header: "Edit",
      cell: ({ row }) => (
        <button
          onClick={() => router.push(`/add-password/${row.original.id}`)}
          className="px-3 py-1 rounded"
          title="Edit"
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
            onClick={() => {
              setSelectedPasswordId(row.original.id);
              setIsModalOpen(true);
            }}
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

      <div className="flex justify-end py-4">
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
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default DashboardPage;
