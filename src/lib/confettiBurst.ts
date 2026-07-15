import confetti from "canvas-confetti";

const WARM_COLORS = ["#F4A582", "#C4842F", "#A8D5BA", "#F4B8C1", "#F5D76E"];

export function burstWarmConfetti(origin?: { x: number; y: number }): void {
  confetti({
    particleCount: 36,
    spread: 55,
    startVelocity: 22,
    gravity: 0.9,
    ticks: 80,
    origin: origin ?? { x: 0.5, y: 0.55 },
    colors: WARM_COLORS,
    scalar: 0.75,
    shapes: ["circle"],
  });
}
