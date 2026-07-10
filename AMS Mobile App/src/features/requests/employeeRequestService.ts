import { supabase } from "../../lib/supabase";
import { EmployeeBundle } from "../database/amsDataService";
import { RequestType } from "./types";

export type EmployeeRequestType = RequestType;

export type EmployeeRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export type EmployeeRequest = {
  id: string;
  employee_id: string;
  organization_id: string;
  branch_id: string;
  type: EmployeeRequestType;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: EmployeeRequestStatus;
  created_at: string;
};

export type CreateEmployeeRequestInput = {
  type: EmployeeRequestType;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

const mapRequestRow = (row: Record<string, unknown>): EmployeeRequest => {
  return {
    id: String(row.id),
    employee_id: String(row.employee_id),
    organization_id: String(row.organization_id),
    branch_id: String(row.branch_id),
    type: String(row.type) as EmployeeRequestType,
    title: String(row.title ?? ""),
    description:
      typeof row.description === "string" ? row.description : null,
    start_date:
      typeof row.start_date === "string" ? row.start_date : null,
    end_date:
      typeof row.end_date === "string" ? row.end_date : null,
    status: String(row.status) as EmployeeRequestStatus,
    created_at: String(row.created_at ?? ""),
  };
};

export const getEmployeeRequests = async (
  bundle: EmployeeBundle
): Promise<EmployeeRequest[]> => {
  const { data, error } = await supabase
    .from("employee_requests")
    .select(
      "id,employee_id,organization_id,branch_id,type,title,description,start_date,end_date,status,created_at"
    )
    .eq("employee_id", bundle.employee.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapRequestRow(row));
};

export const createEmployeeRequest = async (
  bundle: EmployeeBundle,
  input: CreateEmployeeRequestInput
): Promise<EmployeeRequest> => {
  const { data, error } = await supabase
    .from("employee_requests")
    .insert({
      employee_id: bundle.employee.id,
      organization_id: bundle.employee.organization_id,
      branch_id: bundle.employee.branch_id,
      type: input.type,
      title: input.title,
      description: input.description ?? null,
      start_date: input.startDate ?? null,
      end_date: input.endDate ?? input.startDate ?? null,
      status: "pending",
    })
    .select(
      "id,employee_id,organization_id,branch_id,type,title,description,start_date,end_date,status,created_at"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRequestRow(data);
};

export const cancelEmployeeRequest = async (
  bundle: EmployeeBundle,
  requestId: string
): Promise<void> => {
  const { error } = await supabase
    .from("employee_requests")
    .update({ status: "cancelled" })
    .eq("id", requestId)
    .eq("employee_id", bundle.employee.id)
    .eq("status", "pending");

  if (error) {
    throw new Error(error.message);
  }
};
