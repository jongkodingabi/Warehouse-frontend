export default function Stock() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Total Stock</h2>
        {/* Stock overview content goes here */}
        <div className="text-3xl font-bold text-gray-800">1,234</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Total Stock In</h2>
        {/* Stock bar chart content goes here */}
        <div className="text-3xl font-bold text-gray-800">567</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Total Stock Out</h2>
        {/* Stock pie chart content goes here */}
        <div className="text-3xl font-bold text-gray-800">345</div>
      </div>
    </div>
  );
}
