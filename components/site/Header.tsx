"use client";

import { useEffect, useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("body-lock", open);
    return () => document.body.classList.remove("body-lock");
  }, [open]);

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Điều hướng chính">
        <a className="inline-flex items-center" href="/" onClick={() => setOpen(false)}>
          <img className="brand-logo" src="/images/logo-h-club-official.png" alt="H Club" loading="eager" decoding="async" />
        </a>

        <div className="nav-links" id="navLinks">
          <a href="/#live-show" onClick={() => setOpen(false)}>Live Show</a>
          <a href="/#events" onClick={() => setOpen(false)}>Sự kiện</a>
          <a href="/#menu" onClick={() => setOpen(false)}>Menu</a>
          <a href="/#space" onClick={() => setOpen(false)}>Không gian</a>
          <a href="/#booking" onClick={() => setOpen(false)}>Đặt bàn</a>
          <a href="/admin" onClick={() => setOpen(false)}>Admin</a>
        </div>

        <div className="flex items-center gap-3">
          <a className="btn btn-primary nav-cta" href="/#booking">Đặt bàn</a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-controls="navLinks"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
}
