/**
 * Manual ERPNext catalog sync endpoint.
 * POST /api/catalog/sync
 *
 * Triggers a manual sync of the catalog from ERPNext to Supabase.
 * First milestone: manual trigger only. Scheduling and alert delivery are follow-up work.
 *
 * TODO: Add authentication check (require admin role or specific bearer token).
 */

import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import { createERPNextClient, syncCatalogFromERPNext } from "@/lib/erpnext";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // Ensure this runs in Node runtime, not Edge

export async function POST(request: NextRequest) {
  try {
    // TODO: Verify request origin and authentication
    // For now, allow any POST to this endpoint.
    // In production, require:
    // - Bearer token in Authorization header, or
    // - Admin user session from Supabase auth

    // Create clients
    let erpnext;
    let supabase;

    try {
      erpnext = createERPNextClient();
    } catch (err) {
      return NextResponse.json(
        {
          error: "ERPNext not configured",
          message: err instanceof Error ? err.message : "Unknown error",
        },
        { status: 503 },
      );
    }

    try {
      supabase = await createSupabaseServer();
    } catch (err) {
      return NextResponse.json(
        {
          error: "Supabase not available",
          message: err instanceof Error ? err.message : "Unknown error",
        },
        { status: 503 },
      );
    }

    // Run sync
    const result = await syncCatalogFromERPNext(erpnext, supabase);

    return NextResponse.json(
      {
        status: result.status,
        syncRunId: result.syncRunId,
        categoriesImported: result.categoriesImported,
        productsImported: result.productsImported,
        durationMs: result.durationMs,
        error: result.error || null,
      },
      { status: result.status === "success" ? 200 : 500 },
    );
  } catch (err) {
    console.error("[Sync Endpoint Error]", err);
    return NextResponse.json(
      {
        error: "Sync failed",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
