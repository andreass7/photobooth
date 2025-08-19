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
  width: 1280,
  height: 720,
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
  { id: 1, label: "Putih", url: "" },
  { id: 2, label: "Background 1", url: "images/test/1.jpeg" },
  { id: 3, label: "Background 2", url: "images/test/2.jpeg" },
  { id: 4, label: "Background 3", url: "images/test/3.jpeg" },
  { id: 5, label: "Background 4", url: "images/test/4.jpeg" },
  { id: 6, label: "Background 5", url: "images/test/5.jpeg" },
  { id: 7, label: "Background 6", url: "images/test/6.jpeg" },
  { id: 8, label: "Background 7", url: "images/test/7.jpeg" },
  { id: 9, label: "Background 8", url: "images/test/8.jpeg" },
];

const Photobooth = () => {
  const [layoutId, setLayoutId] = useState("3x2");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [layout, setLayout] = useState(layoutConfig["3x2"]);
  const [photos, setPhotos] = useState([]);
  const [captureMode, setCaptureMode] = useState("manual");
  const [countdown, setCountdown] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
  const webcamRef = useRef(null);
  const previewRef = useRef(null);
  const router = useRouter();

  // MOBILE FIX: Track preview container size
  useEffect(() => {
    const updatePreviewSize = () => {
      if (previewRef.current) {
        const rect = previewRef.current.getBoundingClientRect();
        setPreviewSize({ width: rect.width, height: rect.height });
      }
    };

    updatePreviewSize();
    window.addEventListener("resize", updatePreviewSize);

    return () => window.removeEventListener("resize", updatePreviewSize);
  }, [photos.length]);

  useEffect(() => {
    const selected = localStorage.getItem("selectedLayout") || "3x2";
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
  }, [countdown, captureMode]);

  const handleCapture = () => {
    const totalShot = layout.rows * layout.cols;
    if (photos.length >= totalShot || countdown > 0) return;

    if (captureMode === "timer") {
      setCountdown(3);
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

  // MOBILE FIX: Improved drawImageCover with exact same logic as CSS object-fit: cover
  const drawImageCover = (ctx, img, x, y, width, height) => {
    const imgRatio = img.width / img.height;
    const containerRatio = width / height;

    let drawWidth,
      drawHeight,
      offsetX = 0,
      offsetY = 0;

    if (imgRatio > containerRatio) {
      // Image is wider than container
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      // Image is taller than container
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    }

    // Create clipping path
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);

    ctx.restore();
  };

  const handleDownloadAsCollage = async () => {
    const { rows, cols } = layout;

    // MOBILE FIX: Calculate canvas size based on preview aspect ratio
    const previewAspectRatio = previewSize.width / previewSize.height;

    // Base dimensions for high quality output
    let baseWidth = 1200;
    let baseHeight = baseWidth / previewAspectRatio;

    // Ensure minimum height for readability
    if (baseHeight < 800) {
      baseHeight = 800;
      baseWidth = baseHeight * previewAspectRatio;
    }

    // Calculate photo dimensions with proper spacing
    const gap = Math.max(20, baseWidth * 0.02); // Dynamic gap based on canvas size
    const photoWidth = (baseWidth - (cols + 1) * gap) / cols;
    const photoHeight = (baseHeight - (rows + 1) * gap) / rows;

    const canvas = document.createElement("canvas");
    canvas.width = baseWidth;
    canvas.height = baseHeight;

    const ctx = canvas.getContext("2d");

    // MOBILE FIX: Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = baseWidth * dpr;
    canvas.height = baseHeight * dpr;
    canvas.style.width = baseWidth + "px";
    canvas.style.height = baseHeight + "px";
    ctx.scale(dpr, dpr);

    // Background handling
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    if (backgroundImage && backgroundImage !== "") {
      try {
        const bg = new Image();
        bg.src = backgroundImage;
        bg.crossOrigin = "anonymous"; // MOBILE FIX: Handle CORS

        await new Promise((resolve, reject) => {
          bg.onload = resolve;
          bg.onerror = reject;
          // MOBILE FIX: Add timeout for slow connections
          setTimeout(() => reject(new Error("Background load timeout")), 10000);
        });

        drawImageCover(ctx, bg, 0, 0, baseWidth, baseHeight);
      } catch (error) {
        console.warn("Failed to load background image:", error);
      }
    }

    // Draw photos with exact same aspect ratio as preview
    for (let i = 0; i < rows * cols; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = gap + col * (photoWidth + gap);
      const y = gap + row * (photoHeight + gap);

      // Photo slot background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x, y, photoWidth, photoHeight);

      if (i < photos.length) {
        try {
          const img = new Image();
          img.src = photos[i];

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            setTimeout(() => reject(new Error("Photo load timeout")), 5000);
          });

          // MOBILE FIX: Use exact same cover logic as preview
          drawImageCover(ctx, img, x, y, photoWidth, photoHeight);
        } catch (error) {
          console.warn(`Failed to load photo ${i}:`, error);
        }
      }
    }

    // MOBILE FIX: Higher quality JPEG for better results
    const finalImage = canvas.toDataURL("image/jpeg", 0.95);

    // MOBILE FIX: Better download handling for mobile
    const link = document.createElement("a");
    link.href = finalImage;
    link.download = `photobooth-${Date.now()}.jpeg`;

    // For mobile compatibility
    if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
      // Open in new window for mobile
      window.open(finalImage, "_blank");
    } else {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const totalShot = layout.rows * layout.cols;

  const handleReset = () => {
    setPhotos([]);
  };

  // MOBILE FIX: Consistent preview style with exact aspect ratio
  const getPreviewStyle = () => {
    const style = {
      backgroundColor: backgroundColor,
      gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
      gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
    };

    if (backgroundImage && backgroundImage !== "") {
      style.backgroundImage = `url(${backgroundImage})`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
      style.backgroundRepeat = "no-repeat";
    }

    return style;
  };

  return (
    <div className="mx-auto mt-4 p-6 max-w-6xl">
      <h1 className="text-2xl md:text-3xl text-gray-600 font-bold text-center mb-6">
        📸 Photobooth
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 space-y-4 relative">
          <div className="rounded overflow-hidden relative">
            <Webcam
              ref={webcamRef}
              mirrored
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-64 md:h-80 object-cover rounded-xl border-4 border-gray-200"
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
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <span className="text-white text-6xl md:text-7xl font-bold animate-pulse">
                  {countdown}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-400 self-center">
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

          <div className="flex gap-2 flex-wrap">
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
                className="mt-2 w-full"
                color="danger"
              >
                Reset
              </Button>
            ) : (
              <Button
                onPress={handleCapture}
                disabled={photos.length >= totalShot || countdown > 0}
                className="mt-2 w-full"
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
            {/* MOBILE FIX: Preview container with ref for size tracking */}
            <div
              ref={previewRef}
              className="grid gap-1 md:gap-2 border w-full max-w-sm mx-auto p-2 rounded-xl"
              style={getPreviewStyle()}
            >
              {Array.from({ length: totalShot }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden aspect-[4/3]"
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

            <div className="flex items-center gap-2 mt-4 justify-center">
              <label className="text-sm font-semibold text-gray-400">
                Background Color :
              </label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </div>

            <div className="flex gap-2 mt-3 flex-wrap justify-center">
              <p className="text-sm font-semibold text-gray-400 self-center w-full text-center mb-2">
                Background Image :
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                {backgroundOptions.map((bg) => (
                  <div
                    key={bg.id}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer overflow-hidden ${
                      backgroundImage === bg.url
                        ? "border-green-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => setBackgroundImage(bg.url)}
                    title={bg.label}
                  >
                    {bg.url ? (
                      <img
                        src={bg.url}
                        alt={bg.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white border border-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button
              onPress={handleDownloadAsCollage}
              className="mt-6 bg-green-600 text-white font-bold px-4 py-2 w-full"
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
