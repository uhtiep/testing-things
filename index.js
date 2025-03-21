document.addEventListener("DOMContentLoaded", () => {
  const romInput = document.getElementById("romInput");
  const canvas = document.getElementById("emulatorCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 640;
  canvas.height = 480;

  let emulator;

  romInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async function () {
          const romBuffer = new Uint8Array(reader.result);
          runEmulator(romBuffer);
      };
      reader.readAsArrayBuffer(file);
  });

  function runEmulator(romBuffer) {
      if (emulator) emulator.stop();

      emulator = new EmulatorJS({
          canvas: canvas,
          romData: romBuffer,
      });

      emulator.start();
  }
});
