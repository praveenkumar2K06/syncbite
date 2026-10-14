import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  listCustomersApi,
  getCustomerDetailsApi,
  updateCustomerApi,
  type AdminCustomerDetailResponse,
} from "../api/admin";
import type { CustomerData } from "./customers/types";

import CustomerHeader from "./customers/CustomerHeader";
import CustomerFilters from "./customers/CustomerFilters";
import CustomerTable from "./customers/CustomerTable";
import CustomerProfileModal from "./customers/CustomerProfileModal";

export type { CustomerData };

export default function CustomersTab({
  onShowToast,
}: {
  onShowToast: (msg: string, type: "success" | "error") => void;
}) {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "SUSPENDED" | "FLAGGED">(
    "ALL",
  );
  const [_selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const loadRequestId = useRef(0);

  // Load customers exclusively using the official Admin API GET /api/v1/admin/customers
  const loadCustomers = useCallback(async () => {
    const requestId = ++loadRequestId.current;
    setLoading(true);
    try {
      const apiCustomers = await listCustomersApi();
      if (requestId !== loadRequestId.current) return;

      const mapped: CustomerData[] = (apiCustomers || []).map((cust) => {
        const status: "ACTIVE" | "SUSPENDED" = cust.is_active ? "ACTIVE" : "SUSPENDED";
        return {
          id: cust.id,
          user_id: cust.user_id,
          name: cust.full_name || "Campus Student",
          email: cust.email,
          phone: cust.phone_number || "—",
          campus_hostel: "VIT Vellore Campus",
          status,
          is_active: cust.is_active,
          is_verified: cust.is_verified,
          created_at: cust.created_at,
          updated_at: cust.updated_at,
          total_orders: 0,
          total_spent: 0,
          orders: [],
          payments: [],
          reviews: [],
        };
      });

      setCustomers(mapped);
    } catch {
      if (requestId === loadRequestId.current) {
        onShowToast("Failed to load customers from Admin API.", "error");
        setCustomers([]);
      }
    } finally {
      if (requestId === loadRequestId.current) setLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    loadCustomers();
    return () => {
      loadRequestId.current += 1;
    };
  }, [loadCustomers]);

  // Open Customer Detail Modal using GET /api/v1/admin/customers/{customer_id}
  const handleSelectCustomer = useCallback(async (cust: CustomerData) => {
    setSelectedCustomerId(cust.id);
    setSelectedCustomer(cust);
    setModalLoading(true);

    // Attempt to fetch full details from GET /api/v1/admin/customers/{customer_id}
    try {
      const detail: AdminCustomerDetailResponse = await getCustomerDetailsApi(cust.id);
      if (detail && detail.id) {
        const primaryAddr = detail.addresses?.find((a) => a.is_primary) || detail.addresses?.[0];
        const hostelText = primaryAddr
          ? `${primaryAddr.address_line}${primaryAddr.building_name ? `, ${primaryAddr.building_name}` : ""}${primaryAddr.campus_zone ? ` (${primaryAddr.campus_zone})` : ""}`
          : cust.campus_hostel;

        setSelectedCustomer((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            name: detail.full_name || prev.name,
            email: detail.email || prev.email,
            phone: detail.phone_number || prev.phone,
            campus_hostel: hostelText || prev.campus_hostel,
            status: detail.is_active ? "ACTIVE" : "SUSPENDED",
            is_active: detail.is_active,
            is_verified: detail.is_verified,
            total_orders: detail.total_orders ?? prev.total_orders,
            total_spent: detail.total_spent ?? prev.total_spent,
            addresses: detail.addresses || [],
            updated_at: detail.updated_at,
          };
        });
      }
    } catch {
      // Fall back to current cust state
    } finally {
      setModalLoading(false);
    }
  }, []);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.campus_hostel.toLowerCase().includes(q)
      );
    });
  }, [customers, statusFilter, search]);

  // Update customer status using PATCH /api/v1/admin/customers/{customer_id}
  const handleToggleStatus = async (id: string, newStatus: "ACTIVE" | "SUSPENDED" | "FLAGGED") => {
    const isActive = newStatus === "ACTIVE";
    const prevStatus = customers.find((c) => c.id === id)?.status ?? "ACTIVE";

    // Optimistic update
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus, is_active: isActive } : c)),
    );
    if (selectedCustomer?.id === id) {
      setSelectedCustomer((prev) =>
        prev ? { ...prev, status: newStatus, is_active: isActive } : null,
      );
    }

    try {
      await updateCustomerApi(id, {
        is_active: isActive,
      });
      onShowToast(`Customer status updated to ${newStatus}.`, "success");
    } catch {
      // Revert if API call fails
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: prevStatus, is_active: prevStatus === "ACTIVE" } : c,
        ),
      );
      if (selectedCustomer?.id === id) {
        setSelectedCustomer((prev) =>
          prev ? { ...prev, status: prevStatus, is_active: prevStatus === "ACTIVE" } : null,
        );
      }
      onShowToast(`Failed to update customer status via Admin API.`, "error");
    }
  };

  // Full customer profile update using PATCH /api/v1/admin/customers/{customer_id}
  const handleUpdateCustomerProfile = async (
    id: string,
    payload: {
      full_name?: string;
      phone_number?: string;
      is_active?: boolean;
      is_verified?: boolean;
    },
  ) => {
    try {
      const updated = await updateCustomerApi(id, payload);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                name: updated.full_name || c.name,
                phone: updated.phone_number || c.phone,
                is_active: updated.is_active,
                is_verified: updated.is_verified,
                status: updated.is_active ? "ACTIVE" : "SUSPENDED",
              }
            : c,
        ),
      );
      if (selectedCustomer?.id === id) {
        setSelectedCustomer((prev) =>
          prev
            ? {
                ...prev,
                name: updated.full_name || prev.name,
                phone: updated.phone_number || prev.phone,
                is_active: updated.is_active,
                is_verified: updated.is_verified,
                status: updated.is_active ? "ACTIVE" : "SUSPENDED",
                addresses: updated.addresses || prev.addresses,
              }
            : null,
        );
      }
      onShowToast("Customer details successfully updated.", "success");
    } catch {
      onShowToast("Failed to update customer details.", "error");
      throw new Error("Update failed");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <CustomerHeader totalCount={customers.length} onRefresh={loadCustomers} />

      <CustomerFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        filteredCount={filtered.length}
        totalCount={customers.length}
      />

      <CustomerTable
        loading={loading}
        customers={filtered}
        totalCount={customers.length}
        onSelectCustomer={handleSelectCustomer}
        onToggleStatus={handleToggleStatus}
      />

      <CustomerProfileModal
        customer={selectedCustomer}
        loading={modalLoading}
        onClose={() => {
          setSelectedCustomer(null);
          setSelectedCustomerId(null);
        }}
        onToggleStatus={handleToggleStatus}
        onUpdateProfile={handleUpdateCustomerProfile}
      />
    </div>
  );
}
