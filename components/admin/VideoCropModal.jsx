"use client";
import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { AlertCircle, ZoomIn, ZoomOut } from "lucide-react";
import { Modal, ModalHeader, ModalBody, ModalFooter, modalPanel, primaryBtn, secondaryBtn, ghostBtn, iconBtn } from "./ui";

const ASPECTS = [
    { label: "9:16", value: 9 / 16, site: true },
    { label: "4:5", value: 4 / 5 },
    { label: "1:1", value: 1 },
    { label: "16:9", value: 16 / 9 },
    { label: "Original", value: "original" },
];

/* ---------- Video crop dialog ----------
   `src`: object URL or remote URL of the video.
   `onApply({ area, width, height })`: area = crop in percentages, width/height = the video's real size.
   `onSkip()`: use the whole video without cropping. */
const VideoCropModal = ({ src, onApply, onSkip, onCancel, title = "Crop video", applyLabel = "Apply crop", skipLabel = "Use full video" }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspectKey, setAspectKey] = useState(ASPECTS[0].label);
    const [size, setSize] = useState(null);
    const [area, setArea] = useState(null);
    const [failed, setFailed] = useState(false);

    const selected = ASPECTS.find((a) => a.label === aspectKey) || ASPECTS[0];
    const aspect = selected.value === "original" ? (size ? size.width / size.height : 9 / 16) : selected.value;

    const onCropComplete = useCallback((croppedArea) => setArea(croppedArea), []);
    const onMediaLoaded = useCallback(({ naturalWidth, naturalHeight }) => {
        if (naturalWidth > 0 && naturalHeight > 0) setSize({ width: naturalWidth, height: naturalHeight });
        else setFailed(true);
    }, []);

    // The cropper's <video> uses <source> children, whose errors don't reach the video element,
    // so a separate probe tells us when the browser can't play this file
    useEffect(() => {
        const probe = document.createElement("video");
        probe.preload = "metadata";
        probe.muted = true;
        const onError = () => setFailed(true);
        probe.addEventListener("error", onError);
        probe.src = src;
        return () => {
            probe.removeEventListener("error", onError);
            probe.removeAttribute("src");
            probe.load();
        };
    }, [src]);

    const reset = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    const apply = () => {
        if (!area || !size) return;
        onApply({ area, width: size.width, height: size.height });
    };

    return (
        <Modal onClose={onCancel} className="sm:max-w-2xl">
            <div className={modalPanel}>
                <ModalHeader title={title} onClose={onCancel} />
                <ModalBody className="space-y-4">
                    <div className="relative h-[46dvh] sm:h-[400px] -mx-4 sm:mx-0 sm:rounded-lg overflow-hidden bg-stone-900">
                        {failed ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-stone-300">
                                <AlertCircle size={24} />
                                <p className="text-sm">This browser can&apos;t preview this video, so it can&apos;t be cropped here.</p>
                                <p className="text-xs text-stone-400">You can still use the full video.</p>
                            </div>
                        ) : (
                            <Cropper
                                video={src}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}
                                minZoom={1}
                                maxZoom={4}
                                zoomSpeed={0.2}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                onMediaLoaded={onMediaLoaded}
                            />
                        )}
                    </div>

                    {!failed && (
                        <>
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
                                        {a.site && <span className="ml-1 opacity-60">(site)</span>}
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
                            </div>

                            <p className="text-xs text-stone-500">
                                Drag to position · scroll or pinch to zoom. Video reviews show at 9:16 on the site. The original video is kept, so you can re-crop later.
                            </p>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    {!failed && (
                        <button type="button" onClick={reset} className={`${ghostBtn} sm:mr-auto`}>
                            Reset
                        </button>
                    )}
                    <button type="button" onClick={onCancel} className={secondaryBtn}>
                        Cancel
                    </button>
                    <button type="button" onClick={onSkip} className={failed ? primaryBtn : secondaryBtn}>
                        {skipLabel}
                    </button>
                    {!failed && (
                        <button type="button" onClick={apply} disabled={!area || !size} className={primaryBtn}>
                            {applyLabel}
                        </button>
                    )}
                </ModalFooter>
            </div>
        </Modal>
    );
};

export default VideoCropModal;
