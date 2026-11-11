import { Button } from "@/components/ui/button";
import type { FriendActionProps } from "@/types/social";

export function FriendAction({ friendId, label, variant, action }: FriendActionProps) {
  return (
    <form action={action}>
      <input type="hidden" name="friendId" value={friendId} />
      <Button type="submit" size="small" variant={variant}>
        {label}
      </Button>
    </form>
  );
}
