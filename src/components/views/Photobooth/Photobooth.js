import { Button } from "@heroui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { RxValueNone } from "react-icons/rx";

const layoutConfig = {
  "2x1": { rows: 2, cols: 1 },
  "3x1": { rows: 3, cols: 1 },
  "3x2": { rows: 3, cols: 2 },
  "4x1": { rows: 4, cols: 1 },
};

const videoConstraints = {
  width: 700,
  height: 480,
  facingMode: "user",
};

const filterOptions = [
  { id: "none", label: "Normal" },
  { id: "grayscale", label: "Hitam Putih" },
  { id: "sepia", label: "Sepia" },
  { id: "contrast", label: "Kontras Tinggi" },
];

const captureModes = [
  { id: "manual", label: "Manual" },
  { id: "timer", label: "Timer (3 Detik)" },
];

const backgroundOptions = [
  { id: 1, label: "black", url: "" },
  { id: 2, label: "Putih", url: "images/test/1.jpeg" },
  { id: 3, label: "black", url: "images/test/2.jpeg" },
  { id: 4, label: "black", url: "images/test/3.jpeg" },
  { id: 5, label: "black", url: "images/test/4.jpeg" },
  { id: 6, label: "black", url: "images/test/5.jpeg" },
  { id: 7, label: "black", url: "images/test/6.jpeg" },
  { id: 8, label: "black", url: "images/test/7.jpeg" },
  { id: 9, label: "black", url: "images/test/8.jpeg" },
];

const Photobooth = () => {
  const [layoutId, setLayoutId] = useState("3x2");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [layout, setLayout] = useState(layoutConfig["3x2"]);
  const [photos, setPhotos] = useState([]);
  const [captureMode, setCaptureMode] = useState("manual");
  const [countdown, setCountdown] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const webcamRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const selected = localStorage.getItem("selectedLayout") || "2x2";
    setLayoutId(selected);
    setLayout(layoutConfig[selected]);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0 && captureMode === "timer") {
      capturePhoto();
    }
  }, [countdown]);

  const handleCapture = () => {
    if (photos.length >= totalShot || countdown > 0) return;

    if (captureMode === "timer") {
      setCountdown(3); // mulai hitungan mundur 3...2...1
    } else {
      capturePhoto();
    }
  };

  const capturePhoto = () => {
    if (webcamRef.current && photos.length < layout.rows * layout.cols) {
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) return;

      const img = new Image();
      img.src = screenshot;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        switch (selectedFilter) {
          case "grayscale":
            ctx.filter = "grayscale(1)";
            break;
          case "sepia":
            ctx.filter = "sepia(1)";
            break;
          case "contrast":
            ctx.filter = "contrast(2)";
            break;
          default:
            ctx.filter = "none";
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        const filteredImage = canvas.toDataURL("image/jpeg");
        setPhotos((prev) => [...prev, filteredImage]);
      };
    }
  };

  const handleDownloadAsCollage = async () => {
    const { rows, cols } = layout;

    // Ukuran masing-masing foto
    const photoWidth = 600;
    const photoHeight = 480;

    // Jarak antar foto
    const gap = 20;

    // Ukuran total canvas: ditambah total gap antar kolom dan baris
    const canvas = document.createElement("canvas");
    canvas.width = cols * photoWidth + (cols + 1) * gap;
    canvas.height = rows * photoHeight + (rows + 1) * gap;

    const ctx = canvas.getContext("2d");

    if (backgroundImage) {
      const bg = new Image();
      bg.src = backgroundImage;
      await new Promise((resolve) => (bg.onload = resolve));
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // Fungsi mirip CSS background-size: cover
    const drawImageCover = (img, x, y, width, height) => {
      const imgRatio = img.width / img.height;
      const boxRatio = width / height;

      let sx = 0;
      let sy = 0;
      let sWidth = img.width;
      let sHeight = img.height;

      if (imgRatio > boxRatio) {
        const newWidth = img.height * boxRatio;
        sx = (img.width - newWidth) / 2;
        sWidth = newWidth;
      } else {
        const newHeight = img.width / boxRatio;
        sy = (img.height - newHeight) / 2;
        sHeight = newHeight;
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);
    };

    for (let i = 0; i < rows * cols; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      // Posisi X dan Y sudah memperhitungkan gap
      const x = gap + col * (photoWidth + gap);
      const y = gap + row * (photoHeight + gap);

      // Background putih tiap slot (opsional, sudah ada background global)
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(x, y, photoWidth, photoHeight);

      if (i < photos.length) {
        const img = new Image();
        img.src = photos[i];

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        drawImageCover(img, x, y, photoWidth, photoHeight);
      }
    }

    const finalImage = canvas.toDataURL("image/jpeg");

    const link = document.createElement("a");
    link.href = finalImage;
    link.download = "hasil-kolase.jpeg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalShot = layout.rows * layout.cols;

  const handleReset = () => {
    setPhotos([]);
  };

  return (
    <div className="max-w-6xl mx-auto mt-4 p-6">
      <h1 className="text-3xl text-gray-600 font-bold text-center mb-6">
        📸 Photobooth
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="space-y-4 relative">
          <div className=" rounded overflow-hidden relative">
            <Webcam
              ref={webcamRef}
              mirrored
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full lg:h-80 h-screen object-cover rounded-xl border-4 border-gray-200"
              style={{
                filter:
                  selectedFilter === "grayscale"
                    ? "grayscale(1)"
                    : selectedFilter === "sepia"
                    ? "sepia(1)"
                    : selectedFilter === "contrast"
                    ? "contrast(2)"
                    : "none",
              }}
            />
            {countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                <span className="text-green-300 text-7xl font-bold animate-pulse">
                  {countdown}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-400 self-center ">
              Filter :
            </p>
            {filterOptions.map((filter) => (
              <Button
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                className={`text-xs rounded ${
                  selectedFilter === filter.id
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            {captureModes.map((mode) => (
              <Button
                key={mode.id}
                onPress={() => setCaptureMode(mode.id)}
                className={`text-xs rounded ${
                  captureMode === mode.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {mode.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-3">
            {photos.length === totalShot ? (
              <Button
                onPress={handleReset}
                disabled={photos.length === 0}
                className="mt-2"
                color={photos.length === 0 ? "default" : "danger"}
              >
                Reset
              </Button>
            ) : (
              <Button
                onPress={handleCapture}
                disabled={photos.length >= totalShot || countdown > 0}
                className="mt-2"
                color={
                  photos.length >= totalShot || countdown > 0
                    ? "default"
                    : "secondary"
                }
              >
                Ambil Foto ({photos.length}/{totalShot})
              </Button>
            )}
          </div>
        </div>
        {photos.length > 0 && (
          <div className="w-full lg:w-1/2">
            <div
              className="grid gap-2 border w-1/2 mx-auto p-2 rounded-xl"
              style={{
                backgroundColor: backgroundColor,
                backgroundImage: `url(${backgroundImage})`,
                gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
              }}
            >
              {Array.from({ length: totalShot }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 flex items-center justify-center rounded-xl overflow-hidden"
                >
                  {photos[i] ? (
                    <img
                      src={photos[i]}
                      alt={`Foto ${i + 1}`}
                      className="object-cover w-full h-full"
                    />
                  ) : null}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <label className="text-sm font-semibold text-gray-400 self-center ">
                Background Color :
              </label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <p className="text-sm font-semibold text-gray-400 self-center ">
                Background Image :
              </p>
              {backgroundOptions.map((bg) => (
                <div
                  key={bg.id}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer overflow-hidden ${
                    backgroundImage === bg.url
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setBackgroundImage(bg.url)}
                >
                  <img
                    src={bg.url}
                    alt={bg.label}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <Button
              onPress={handleDownloadAsCollage}
              className="mt-4 bg-green-600 text-white font-bold px-4 py-2 w-full"
            >
              Download Kolase
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Photobooth;
