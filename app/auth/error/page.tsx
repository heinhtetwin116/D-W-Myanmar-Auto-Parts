import { Card } from "antd";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p style={{ color: "#8c8c8c", fontSize: "14px" }}>
          Code error: {params.error}
        </p>
      ) : (
        <p style={{ color: "#8c8c8c", fontSize: "14px" }}>
          An unspecified error occurred.
        </p>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card title="Sorry, something went wrong." style={{ width: "100%" }}>
          <Suspense>
            <ErrorContent searchParams={searchParams} />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [];
}
