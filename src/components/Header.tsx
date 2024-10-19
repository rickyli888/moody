import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b p-4">
      <h1 className="text-2xl font-bold">All Your Playlists</h1>
      {user && (
        <div className="flex items-center space-x-4">
          <span className="font-semibold">{user.name}</span>
          <Avatar>
            <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  );
}
