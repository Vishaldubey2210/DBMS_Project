// src/features/auth/components/AvatarUpload.tsx
"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function AvatarUpload({
  currentUrl,
  userName,
}: {
  currentUrl: string | null;
  userName:   string;
}) {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setError("");

    try {
      // Get presigned URL from uploadthing
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/api/uploadthing", {
        method: "POST",
        body:   formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Upload failed");
      setPreview(currentUrl);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        {preview ? (
          <img
            src={preview}
            alt={userName}
            className="w-20 h-20 rounded-full object-cover border-2 border-green-600"
          />
        ) : (
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-3xl font-bold text-white border-2 border-green-600">
            {userName[0].toUpperCase()}
          </div>
        )}

        {/* Overlay on hover */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={loading}
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
        >
          <span className="text-xs text-white font-medium">
            {loading ? "⏳" : "📷"}
          </span>
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={() => fileRef.current?.click()}
        disabled={loading}
        className="text-xs text-green-400 hover:text-green-300 transition disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Change Photo"}
      </button>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
