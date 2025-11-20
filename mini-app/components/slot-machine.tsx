"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [columns, setColumns] = useState<Fruit[][]>([
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState<string | null>(null);

  // Spin logic
  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(null);
    const interval = setInterval(() => {
      setColumns((prev) => {
        const newCols = prev.map((col) => [
          randomFruit(),
          ...col.slice(0, 2),
        ]);
        return newCols;
      });
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      // Check win condition directly in render
    }, 2000);
  };

  // Check win condition
  const checkWin = () => {
    // Rows
    for (let r = 0; r < 3; r++) {
      const row = columns.map((c) => c[r]);
      if (row.every((f) => f === row[0])) return row[0];
    }
    // Columns
    for (let c = 0; c < 3; c++) {
      const col = columns[c];
      if (col.every((f) => f === col[0])) return col[0];
    }
    return null;
  };

  useEffect(() => {
    if (!spinning) {
      const w = checkWin();
      if (w) setWin(`You win with ${w}!`);
    }
  }, [columns, spinning]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {col.map((fruit, ri) => (
              <img
                key={ri}
                src={`/${fruit}.png`}
                alt={fruit}
                width={80}
                height={80}
                className="border rounded"
              />
            ))}
          </div>
        ))}
      </div>
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {win && (
        <div className="mt-4 text-green-600">
          <p>{win}</p>
          <Share text={`${win} ${url}`} />
        </div>
      )}
    </div>
  );
}
