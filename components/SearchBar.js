"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchIcon } from "./Icons";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");

  function submit(e) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form className="search-bar" role="search" onSubmit={submit}>
      <SearchIcon style={{ color: "var(--ink-faint)" }} />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher une caméra de chasse 4G"
      />
      <button className="search-submit" type="submit" aria-label="Rechercher">
        <SearchIcon />
      </button>
    </form>
  );
}
