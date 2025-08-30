export function playNotification() {
  const audio = document.getElementById(
    "notify-sound"
  ) as HTMLAudioElement | null;
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {
      console.warn("[Sound] play() failed — maybe still locked");
    });
  }
}
