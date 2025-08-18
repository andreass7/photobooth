import { useRouter } from "next/router";
import { useState } from "react";

const layoutOption = [
  { id: "2x1", label: "2 x 1", rows: 2, cols: 1 },
  { id: "3x1", label: "3 x 1", rows: 3, cols: 1 },
  { id: "3x2", label: "3 x 2", rows: 3, cols: 2 },
  { id: "4x1", label: "4 x 1", rows: 4, cols: 1 },
];

const Layout = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const handleSelect = (layoutId) => {
    setSelected(layoutId);
    localStorage.setItem("selectedLayout", layoutId);
    router.push("/photobooth");
  };

  return (
    <div className="mt-8 p-6">
      <div className="text-start">
        <h1 className="text-3xl text-green-400 font-semibold">Pilih Layout</h1>
        <h3 className="text-md text-gray-600 font-medium mb-6">
          Silahkan Pilih Layout di Bawah Ini
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {layoutOption.map((layout) => (
          <div
            key={layout.id}
            onClick={() => handleSelect(layout.id)}
            className={` bg-green-300 p-6 cursor-pointer rounded-xl text-center shadow hover:shadow-lg transition ${
              selected === layout.id
                ? "border-green-400 ring-2 ring-green-300"
                : ""
            }`}
          >
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Ukuran Canvas : {layout.label}
            </div>
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
              }}
            >
              {Array.from({ length: layout.rows * layout.cols }).map((_, i) => (
                <div key={i} className="bg-gray-200 h-20 rounded-xl "></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Layout;
