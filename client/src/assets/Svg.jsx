import { ChartNoAxesCombined } from "lucide-react";
import { useEffect } from "react";

export const FaviconGenerator = () => {
  useEffect(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff1493" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 16v5"/>
        <path d="M16 14v7"/>
        <path d="M20 10v11"/>
        <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/>
        <path d="M4 18v3"/>
        <path d="M8 14v7"/>
      </svg>
    `;

    const base64 = btoa(svg);
    const faviconUrl = `data:image/svg+xml;base64,${base64}`;

    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, []);

  return null;
};
