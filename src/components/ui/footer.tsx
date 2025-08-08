export default function Footer() {
  return (
    <div className="bg-slate-50 py-8 flex items-center justify-center relative bottom-0 left-0">
      <p className="text-secondary font-medium text-sm">
        Copyright &copy; {new Date().getFullYear()} Warehouse Management. All
        Right Reversed.
      </p>
    </div>
  );
}
