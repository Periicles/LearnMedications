import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="secondary" fullWidth>
        <LogOut className="size-5" aria-hidden="true" /> Se déconnecter
      </Button>
    </form>
  );
}
