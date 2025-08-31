// components/layout/Header.tsx
interface HeaderProps {
  session: {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export function Header({ session }: HeaderProps) {
  return (
    <div className="bg-white shadow-sm p-4 mb-6">
      <div className="flex items-center gap-3">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt="Profile Picture"
            className="h-10 w-10 rounded-full"
          />
        )}
        {/* <div>
          <h2 className="text-xl font-semibold">
            Welcome, {session.user?.name}
          </h2>
          <p className="text-gray-600">{session.user?.email}</p>
        </div> */}
      </div>
    </div>
  )
}
