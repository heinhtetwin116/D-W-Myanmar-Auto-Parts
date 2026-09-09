import Link from "next/link";
import { Button } from "antd";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span>Hey, {user.email}!</span>
      <LogoutButton />
    </div>
  ) : (
    <div style={{ display: "flex", gap: 8 }}>
      <Button type="default" size="small">
        <Link href="/auth/login" style={{ textDecoration: "none", color: "inherit" }}>
          Sign in
        </Link>
      </Button>
      <Button type="primary" size="small">
        <Link href="/auth/sign-up" style={{ textDecoration: "none", color: "inherit" }}>
          Sign up
        </Link>
      </Button>
    </div>
  );
}