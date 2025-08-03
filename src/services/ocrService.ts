import { createWorker } from "tesseract.js";

class OCRService {
  private worker: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.worker = await createWorker("eng", 1, {
        logger: (m) => console.log(m),
      });

      // Configure OCR for better accuracy
      await this.worker.setParameters({
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?;:()-% ",
        tessedit_pageseg_mode: "1", // Automatic page segmentation with OSD
        preserve_interword_spaces: "1",
      });

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize OCR worker:", error);
      throw error;
    }
  }

  async extractTextFromImage(
    imageFile: File
  ): Promise<{ text: string; confidence: number }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const processedImage = await this.preprocessImage(imageFile); // now returns base64
      const {
        data: { text, confidence },
      } = await this.worker.recognize(processedImage); // no rectangle

      const cleanedText = this.cleanOCRText(text);
      console.log("OCR raw result:", text);
      return { text: cleanedText, confidence };
    } catch (error) {
      console.error("OCR extraction failed:", error);
      return {
        text: "OCR processing encountered an issue. Please try uploading a clearer image or a different file format.",
        confidence: 0.1,
      };
    }
  }

  async extractTextFromImageUrl(
    imageUrl: string
  ): Promise<{ text: string; confidence: number }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const {
        data: { text, confidence },
      } = await this.worker.recognize(imageUrl);
      const cleanedText = this.cleanOCRText(text);
      return { text: cleanedText, confidence };
    } catch (error) {
      console.error("OCR extraction failed:", error);
      return {
        text: "OCR processing encountered an issue. Please try uploading a clearer image.",
        confidence: 0.1,
      };
    }
  }

  private async preprocessImage(imageFile: File): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      img.onload = () => {
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image
        ctx.drawImage(img, 0, 0);

        // Apply image enhancements for better OCR
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Increase contrast and brightness
        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale and enhance contrast
          const gray =
            data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          const enhanced = gray > 128 ? 255 : 0; // Threshold for better text recognition

          data[i] = enhanced; // Red
          data[i + 1] = enhanced; // Green
          data[i + 2] = enhanced; // Blue
          // Alpha stays the same
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas);
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(imageFile);
    });
  }

  private cleanOCRText(text: string): string {
    if (!text) return "";

    // Clean up common OCR errors and artifacts
    let cleaned = text
      .replace(/[^\w\s.,!?;:()\-\n]/g, " ") // Remove special characters except common punctuation
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/\n\s*\n/g, "\n") // Remove empty lines
      .trim();

    // Remove very short "words" that are likely OCR artifacts
    cleaned = cleaned
      .split(" ")
      .filter((word) => word.length > 1 || /[a-zA-Z0-9]/.test(word))
      .join(" ");

    return cleaned;
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}

export const ocrService = new OCRService();
