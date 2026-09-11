import { Card } from "antd";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <Card title="Thank you for signing up!" style={{ width: "100%" }}>
            <p style={{ color: "#8c8c8c" }}>
              You&apos;ve successfully signed up. Please check your email to
              confirm your account before signing in.
            </p>
          </Card>
        </Suspense>
      </div>
    </div>
  );
}
