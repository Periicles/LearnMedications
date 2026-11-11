import type { MetadataRoute } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: "LearnMeds",
    description: APP_DESCRIPTION,
    lang: "fr",
    start_url: ROUTES.learn,
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f6f8f7",
    theme_color: "#0f9d8a",
    categories: ["education", "medical"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
