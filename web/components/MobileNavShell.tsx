"use client";

import React, { useState } from "react";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileDesksDrawer } from "./MobileDesksDrawer";

export function MobileNavShell() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <MobileBottomNav onOpenDesks={() => setIsDrawerOpen(true)} />
      <MobileDesksDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
