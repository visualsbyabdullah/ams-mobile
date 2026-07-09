import { supabase } from "../../lib/supabase";
import { EmployeeBundle } from "../database/amsDataService";
import { canCreateSaleEntry } from "../policies/guards";

export type CreateSalesEntryInput = {
  salesCount: number;
  amount?: number;
  productOrService?: string;
  customerName?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  locationAccuracyMeters?: number;
  preciseLocationVerified?: boolean;
  attachmentUrl?: string;
};

export type SalesEntry = {
  id: string;
  employee_id: string;
  organization_id: string;
  branch_id: string;
  sales_count: number;
  amount: number | null;
  product_or_service: string | null;
  customer_name: string | null;
  sale_time: string;
  latitude: number | null;
  longitude: number | null;
  location_accuracy_meters: number | null;
  precise_location_verified: boolean;
  notes: string | null;
  attachment_url: string | null;
  created_at: string;
};

const assertSalesAllowed = (bundle: EmployeeBundle) => {
  if (!canCreateSaleEntry(bundle.resolvedPolicy)) {
    throw new Error("SALES_MODULE_NOT_ALLOWED");
  }
};

export const createSalesEntry = async (
  bundle: EmployeeBundle,
  input: CreateSalesEntryInput
) => {
  assertSalesAllowed(bundle);

  if (!Number.isFinite(input.salesCount) || input.salesCount <= 0) {
    throw new Error("SALES_COUNT_REQUIRED");
  }

  const { data, error } = await supabase
    .from("sales_entries")
    .insert({
      employee_id: bundle.employee.id,
      organization_id: bundle.employee.organization_id,
      branch_id: bundle.employee.branch_id,
      sales_count: input.salesCount,
      amount: input.amount ?? null,
      product_or_service: input.productOrService ?? null,
      customer_name: input.customerName ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      location_accuracy_meters: input.locationAccuracyMeters ?? null,
      precise_location_verified: input.preciseLocationVerified ?? false,
      notes: input.notes ?? null,
      attachment_url: input.attachmentUrl ?? null,
    })
    .select("*")
    .single<SalesEntry>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getOwnSalesEntries = async (bundle: EmployeeBundle) => {
  const salesPolicy = bundle.resolvedPolicy.modules.sales;

  if (!salesPolicy?.enabled || !salesPolicy.assigned) {
    throw new Error("SALES_MODULE_NOT_ALLOWED");
  }

  const { data, error } = await supabase
    .from("sales_entries")
    .select("*")
    .eq("employee_id", bundle.employee.id)
    .order("sale_time", { ascending: false })
    .limit(30)
    .returns<SalesEntry[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};
