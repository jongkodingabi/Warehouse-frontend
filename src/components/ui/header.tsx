export default function Header() {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-14 md:mt-4 px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center space-x-3 md:space-x-4">
        <h1 className="text-lg md:text-xl font-semibold text-white">
          Dashboard Super Admin
        </h1>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
      </div>{" "}
    </header>
  );
}
