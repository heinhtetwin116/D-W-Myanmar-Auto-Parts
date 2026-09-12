/**
 * Server-only ERPNext REST API client.
 * Never import or use this in Client Components.
 * Never expose ERPNext credentials to the browser.
 */

interface ERPNextClientOptions {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
}

interface ERPNextListParams {
  fields?: string[];
  filters?: Array<[string, string, string | number | boolean]>;
  orderBy?: string;
  limitStart?: number;
  limitPageLength?: number;
}

interface ERPNextDocType {
  name: string;
  [key: string]: unknown;
}

export class ERPNextClient {
  private baseUrl: string;
  private token: string;

  constructor(options: ERPNextClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, ""); // remove trailing slash
    this.token = `token ${options.apiKey}:${options.apiSecret}`;
  }

  /**
   * List documents of a given DocType with optional filters, pagination, and field selection.
   * Returns an array of documents.
   */
  async listDocuments<T extends ERPNextDocType>(
    docType: string,
    params: ERPNextListParams = {},
  ): Promise<T[]> {
    const url = new URL(`/api/resource/${docType}`, this.baseUrl);

    if (params.fields && params.fields.length > 0) {
      url.searchParams.set("fields", JSON.stringify(params.fields));
    }

    if (params.filters && params.filters.length > 0) {
      url.searchParams.set("filters", JSON.stringify(params.filters));
    }

    if (params.orderBy) {
      url.searchParams.set("order_by", params.orderBy);
    }

    if (params.limitStart !== undefined) {
      url.searchParams.set("limit_start", params.limitStart.toString());
    }

    if (params.limitPageLength !== undefined) {
      url.searchParams.set(
        "limit_page_length",
        params.limitPageLength.toString(),
      );
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: this.token,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `ERPNext API error (${response.status}): ${text || response.statusText}`,
      );
    }

    const data = (await response.json()) as { data: T[] };
    return data.data || [];
  }

  /**
   * Get a single document by name.
   */
  async getDocument<T extends ERPNextDocType>(
    docType: string,
    name: string,
  ): Promise<T> {
    const url = new URL(`/api/resource/${docType}/${name}`, this.baseUrl);
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: this.token,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `ERPNext API error (${response.status}): ${text || response.statusText}`,
      );
    }

    const data = (await response.json()) as { data: T };
    return data.data;
  }
}

/**
 * Create and return a server-only ERPNext client.
 * Requires ERPNEXT_BASE_URL, ERPNEXT_API_KEY, and ERPNEXT_API_SECRET to be set.
 */
export function createERPNextClient(): ERPNextClient {
  const baseUrl = process.env.ERPNEXT_BASE_URL;
  const apiKey = process.env.ERPNEXT_API_KEY;
  const apiSecret = process.env.ERPNEXT_API_SECRET;

  if (!baseUrl || !apiKey || !apiSecret) {
    throw new Error(
      "ERPNext credentials not configured: ERPNEXT_BASE_URL, ERPNEXT_API_KEY, and ERPNEXT_API_SECRET must be set",
    );
  }

  return new ERPNextClient({ baseUrl, apiKey, apiSecret });
}
