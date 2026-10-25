$code = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class LogoProcessor {
    public static void ProcessLogo(string inputPath, string outputPath, string faviconPath) {
        using (Bitmap src = new Bitmap(inputPath)) {
            int w = src.Width;
            int h = src.Height;
            Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
            using (Graphics g = Graphics.FromImage(bmp)) {
                g.DrawImage(src, 0, 0, w, h);
            }

            bool[,] visited = new bool[w, h];
            Queue<Point> queue = new Queue<Point>();

            // Seed borders
            for (int x = 0; x < w; x++) {
                Color cTop = bmp.GetPixel(x, 0);
                if (cTop.R > 225 && cTop.G > 225 && cTop.B > 225) {
                    queue.Enqueue(new Point(x, 0));
                    visited[x, 0] = true;
                }
                Color cBot = bmp.GetPixel(x, h - 1);
                if (cBot.R > 225 && cBot.G > 225 && cBot.B > 225) {
                    queue.Enqueue(new Point(x, h - 1));
                    visited[x, h - 1] = true;
                }
            }
            for (int y = 0; y < h; y++) {
                Color cLeft = bmp.GetPixel(0, y);
                if (cLeft.R > 225 && cLeft.G > 225 && cLeft.B > 225 && !visited[0, y]) {
                    queue.Enqueue(new Point(0, y));
                    visited[0, y] = true;
                }
                Color cRight = bmp.GetPixel(w - 1, y);
                if (cRight.R > 225 && cRight.G > 225 && cRight.B > 225 && !visited[w - 1, y]) {
                    queue.Enqueue(new Point(w - 1, y));
                    visited[w - 1, y] = true;
                }
            }

            Color transparent = Color.FromArgb(0, 0, 0, 0);
            int[] dx = { 1, -1, 0, 0 };
            int[] dy = { 0, 0, 1, -1 };

            while (queue.Count > 0) {
                Point pt = queue.Dequeue();
                bmp.SetPixel(pt.X, pt.Y, transparent);

                for (int i = 0; i < 4; i++) {
                    int nx = pt.X + dx[i];
                    int ny = pt.Y + dy[i];
                    if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[nx, ny]) {
                        visited[nx, ny] = true;
                        Color nc = bmp.GetPixel(nx, ny);
                        if (nc.R > 225 && nc.G > 225 && nc.B > 225) {
                            queue.Enqueue(new Point(nx, ny));
                        }
                    }
                }
            }

            // Find bounding box
            int minX = w, maxX = 0, minY = h, maxY = 0;
            for (int x = 0; x < w; x++) {
                for (int y = 0; y < h; y++) {
                    if (bmp.GetPixel(x, y).A > 20) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            int cropW = maxX - minX + 1;
            int cropH = maxY - minY + 1;
            Console.WriteLine("Cropped bounds: " + minX + "," + minY + " size " + cropW + "x" + cropH);

            using (Bitmap cropped = new Bitmap(cropW, cropH, PixelFormat.Format32bppArgb)) {
                using (Graphics g = Graphics.FromImage(cropped)) {
                    g.DrawImage(bmp, 0, 0, new Rectangle(minX, minY, cropW, cropH), GraphicsUnit.Pixel);
                }
                cropped.Save(outputPath, ImageFormat.Png);
                cropped.Save(faviconPath, ImageFormat.Png);
            }
            bmp.Dispose();
            Console.WriteLine("Done saving transparent logo.");
        }
    }
}
"@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing
[LogoProcessor]::ProcessLogo("d:\PPTX\public\logo.jpg", "d:\PPTX\public\logo.png", "d:\PPTX\public\favicon.png")
