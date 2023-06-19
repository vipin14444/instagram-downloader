"use client";
import { useState } from "react";
import { getReelSource } from "./actions";

export default function Home() {
  const [value, setValue] = useState("");

  return (
    <div className="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 min-h-screen text-white">
      <section className="p-4 text-center">
        <h1 className="text-2xl font-bold">Instagram Downloader</h1>
        <p className="mt-2 text-xs">Created with ❤️</p>
        <p className="mt-2 text-xs">
          Paste a valid reel url and press download
        </p>
      </section>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const videoUrl = await getReelSource(value);
          if (videoUrl) {
            window.open(videoUrl);
          }
        }}
        className="flex flex-col p-4 gap-4"
      >
        <input
          placeholder="Paste reel url"
          className="placeholder:text-[#757575] text-[#2a2a2a] px-3 py-2 rounded"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Download
        </button>
      </form>
    </div>
  );
}
