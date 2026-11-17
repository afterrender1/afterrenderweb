"use client";
import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Loader2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Modal, ModalHeader, ModalBody, ModalFooter, modalPanel, primaryBtn, secondaryBtn, ghostBtn, iconBtn } from "./ui";

// Longest side of the saved image; keeps the upload small without visible quality loss
const MAX_OUTPUT_SIDE = 1920;
// Stay under the canvas area limit of mobile Safari (~16.7M pixels)
const MAX_CANVAS_PIXELS = 16_000_000;

const ASPECTS = [
    { label: "16:9", value: 16 / 9 },
    { label: "4:3", value: 4 / 3 },
    { label: "1:1", value: 1 },
    { label: "Original", value: "original" },
];

const toRadians = (deg) => (deg * Math.PI) / 180;

const loadImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("The image could not be read."));
        img.src = src;
    });

// Draws the rotated image, cuts out `crop` (pixels of the rotated image) and returns a JPEG data URL
export const cropImage = async (src, crop, rotation = 0) => {
    const img = await loadImage(src);
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const rad = toRadians(rotation);
    const boxW = Math.abs(Math.cos(rad) * w) + Math.abs(Math.sin(rad) * h);
    const boxH = Math.abs(Math.sin(rad) * w) + Math.abs(Math.cos(rad) * h);

    // Downscale the working canvas for very large photos so phones can still draw it
    const scale = Math.min(1, Math.sqrt(MAX_CANVAS_PIXELS / (boxW * boxH)));

    const rotated = document.createElement("canvas");
    rotated.width = Math.round(boxW * scale);
    rotated.height = Math.round(boxH * scale);
    const rctx = rotated.getContext("2d");
    if (!rctx) throw new Error("Your browser could not crop this image.");
    rctx.imageSmoothingQuality = "high";
    rctx.translate(rotated.width / 2, rotated.height / 2);
    rctx.rotate(rad);
    rctx.scale(scale, scale);
    rctx.drawImage(img, -w / 2, -h / 2);

    const sx = crop.x * scale;
    const sy = crop.y * scale;
    const sw = crop.width * scale;
    const sh = crop.height * scale;

    const outScale = Math.min(1, MAX_OUTPUT_SIDE / Math.max(sw, sh));
    const out = document.createElement("canvas");
    out.width = Math.max(1, Math.round(sw * outScale));
    out.height = Math.max(1, Math.round(sh * outScale));
    const octx = out.getContext("2d");
    if (!octx) throw new Error("Your browser could not crop this image.");
    // JPEG has no transparency, so transparent areas become white instead of black
    octx.fillStyle = "#ffffff";
    octx.fillRect(0, 0, out.width, out.height);
    octx.imageSmoothingQuality = "high";
    octx.drawImage(rotated, sx, sy, sw, sh, 0, 0, out.width, out.height);

    return out.toDataURL("image/jpeg", 0.9);
};

/* ---------- Crop dialog ----------
   `src`: object/data URL of the original image. `onApply(dataUrl)` gets the cropped JPEG. */
const ImageCropModal = ({ src, onApply, onCancel, title = "Crop image" }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspectKey, setAspectKey] = useState(ASPECTS[0].label);
    const [originalAspect, setOriginalAspect] = useState(16 / 9);
    const [areaPixels, setAreaPixels] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const selected = ASPECTS.find((a) => a.label === aspectKey);
    const aspect = selected.value === "original" ? originalAspect : selected.value;

    const onCropComplete = useCallback((_, pixels) => setAreaPixels(pixels), []);
    const onMediaLoaded = useCallback(({ naturalWidth, naturalHeight }) => {
        if (naturalWidth && naturalHeight) setOriginalAspect(naturalWidth / naturalHeight);
    }, []);

    const close = useCallback(() => {
        if (!busy) onCancel();
    }, [busy, onCancel]);

    const reset = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
    };

    // Swapping width/height on a 90° turn keeps "Original" matching the rotated picture
    const rotate = (delta) => setRotation((r) => (r + delta + 360) % 360);
    const effectiveAspect = selected.value === "original" && rotation % 180 !== 0 ? 1 / aspect : aspect;

    const apply = async () => {
        if (!areaPixels) return;
        setBusy(true);
        setError("");
        try {
            onApply(await cropImage(src, areaPixels, rotation));
        } catch (err) {
            setError(err?.message || "Could not crop this image.");
            setBusy(false);
        }
    };

    return (
        <Modal onClose={close} className="sm:max-w-2xl">
            <div className={modalPanel}>
                <ModalHeader title={title} onClose={close} disabled={busy} />
                <ModalBody className="space-y-4">
                    <div className="relative h-[46dvh] sm:h-[400px] -mx-4 sm:mx-0 sm:rounded-lg overflow-hidden bg-stone-900">
                        <Cropper
                            image={src}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={effectiveAspect}
                            minZoom={1}
                            maxZoom={4}
                            zoomSpeed={0.2}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            onMediaLoaded={onMediaLoaded}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Aspect ratio">
                        <span className="text-xs font-medium text-stone-500 mr-1">Ratio</span>
                        {ASPECTS.map((a) => (
                            <button
                                key={a.label}
                                type="button"
                                onClick={() => setAspectKey(a.label)}
                                aria-pressed={aspectKey === a.label}
                                className={`h-8 px-3 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                                    aspectKey === a.label
                                        ? "bg-stone-900 border-stone-900 text-stone-50"
                                        : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                                }`}
                            >
                                {a.label}
                                {a.label === "16:9" && <span className="ml-1 opacity-60">(site)</span>}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))} className={iconBtn} aria-label="Zoom out" title="Zoom out">
                            <ZoomOut size={16} />
                        </button>
                        <input
                            type="range"
                            min={1}
                            max={4}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            aria-label="Zoom"
                            className="flex-1 min-w-0 accent-stone-900 cursor-pointer"
                        />
                        <button type="button" onClick={() => setZoom((z) => Math.min(4, +(z + 0.2).toFixed(2)))} className={iconBtn} aria-label="Zoom in" title="Zoom in">
                            <ZoomIn size={16} />
                        </button>
                        <span className="w-px h-5 bg-stone-200 mx-1" aria-hidden="true" />
                        <button type="button" onClick={() => rotate(-90)} className={iconBtn} aria-label="Rotate left" title="Rotate left">
                            <RotateCcw size={16} />
                        </button>
                        <button type="button" onClick={() => rotate(90)} className={iconBtn} aria-label="Rotate right" title="Rotate right">
                            <RotateCw size={16} />
                        </button>
                    </div>

                    <p className="text-xs text-stone-500">Drag to position · scroll or pinch to zoom. Blog covers show at 16:9 on the site.</p>
                    {error && (
                        <p className="text-xs text-red-600" role="alert">
                            {error}
                        </p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <button type="button" onClick={reset} disabled={busy} className={`${ghostBtn} sm:mr-auto`}>
                        Reset
                    </button>
                    <button type="button" onClick={close} disabled={busy} className={secondaryBtn}>
                        Cancel
                    </button>
                    <button type="button" onClick={apply} disabled={busy || !areaPixels} className={primaryBtn}>
                        {busy && <Loader2 size={16} className="animate-spin" />}
                        {busy ? "Cropping..." : "Apply crop"}
                    </button>
                </ModalFooter>
            </div>
        </Modal>
    );
};

export default ImageCropModal;
