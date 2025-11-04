import { UserNav } from './user-nav';

export function Header() {
  return (
    <header className="border-b border-gray-700 bg-gray-900">
      <div className="flex h-16 items-center px-4 md:px-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight">Loot Reward</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
