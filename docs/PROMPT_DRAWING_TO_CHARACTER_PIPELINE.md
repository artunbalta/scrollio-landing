# Prompt: Build the “Drawing → AI Mentor Character” Pipeline (Web Playground – Draw Section)

Use this prompt to have an AI or a developer implement the full pipeline from scratch. This is for the **web product**: a **playground** that includes a **Draw** section where users create a character that is then turned into an AI mentor image.

---

## 1. Product context

This is **not a one-off demo**. You are building the **Draw section of a web playground** (the app lives on the web; the playground is a dedicated area of the product). In that playground:

- There is a **Draw** area: the user (e.g. a child or parent) draws a character on a canvas (e.g. “my dream mentor”).
- The drawing is sent to the backend and transformed by AI into a **Pixar-style 3D mascot / character image**.
- Optionally, the user can enter an email and child’s name; the generated character image (and optionally the original drawing) is sent to that email.
- Optionally, the user can request an **educational short video** starring that character (e.g. teaching a topic); the character image is used as the “face” of the video.

The pipeline is part of the **main web experience** (playground → Draw section). It must be **child-safe**, **simple** (minimal steps), and **robust** (clear errors, no silent failures). Prefer a **single image-to-image** step for drawing → character (no separate “describe the drawing” step unless you explicitly add it later).

---

## 2. Tech stack and environment

- **Frontend:** Next.js (App Router), React, TypeScript. The drawing UI is a client component that lives inside the **playground’s Draw section** (one area of the web app).
- **Backend:** Next.js API routes (server-side). Use server-side API keys only; never expose FAL or Resend keys to the client.
- **AI:** [FAL](https://fal.ai) (fal-ai/client). You will need:
  - **Image-to-image (drawing → character):** Use the FAL model that accepts an image + text prompt and returns a new image. In our reference we use `fal-ai/nano-banana-pro/edit` with a long, detailed “Pixar-style transformation” prompt. You must pass the child’s drawing as one of the input images and a single, fixed prompt that instructs the model to turn the drawing into a high-fidelity, Pixar-style 3D mascot while preserving silhouette, proportions, colors, and distinctive details.
  - **Optional video:** Use an image-to-video model (e.g. FAL’s Sora 2 image-to-video) that takes the generated character image and a text prompt (e.g. “A cute animated mentor character teaching a child about [topic]…”) and returns a short video URL.
- **Database:** Supabase. One table to store each “drawing → mentor” pair (and optional metadata like email, child name). The table should have at least: `original_drawing` (text, base64 or URL), `mentor_image_url` (text), `drawing_description` (text), `user_email` (text, nullable), `child_name` (text, nullable), `created_at` (timestamp). Use the Supabase client from a server-side API route (or a server action) so the anon key is not abused; prefer Row Level Security (RLS) and service role or a dedicated backend key if you write from the server.
- **Email (optional):** Resend (or another transactional email provider). Send one email per “mentor ready” event, with the mentor image attached or inlined, and optionally the original drawing. The email should be clearly from your product and include a short, child-friendly message (e.g. “Your mentor is ready!”) and a link to your app.

**Environment variables (example names):**

- `FAL_KEY` – FAL API key (server-only).
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase project (client can use anon for reads if needed; writes from server can use the same or a service role key if stored securely).
- `RESEND_API_KEY` – Resend API key (server-only).
- Any Supabase service role or custom backend key if you use it for writes.

Do not hardcode these; use env vars and validate them at runtime in the API route.

---

## 3. Frontend: drawing and submission flow

### 3.1 Drawing canvas

- Provide a **single canvas** (e.g. 400×300 px internal resolution) where the user can draw with mouse and touch (pointer events). Maintain aspect ratio when responsive (e.g. 4:3).
- **Drawing tools:**
  - A small set of **colors** (e.g. 8: black, red, orange, yellow, green, blue, purple, pink). Click to select; active color is clearly indicated.
  - **Brush size** (e.g. 1–20 px), controllable via a range input. Use round line cap and join for strokes.
  - **Eraser** (same or larger size), which draws in the canvas background color (e.g. white).
  - **Undo** (one step back) and **Clear** (full canvas reset to background color).
- Initialize the canvas with a **white background**. Persist stroke color, brush/eraser size, and eraser mode in React state; redraw on a 2D context with `lineTo`/`moveTo` and store history for undo (e.g. snapshot of `ImageData` before each stroke).
- Ensure the canvas is **accessible** (labels, aria where needed) and works on **touch devices** (prevent default where necessary so the page doesn’t scroll while drawing).

### 3.2 Data collected with the drawing

- **Required:** The drawing itself, exported as a **single image** when the user clicks “Create my mentor” (or equivalent). Export as PNG, then convert to **base64 data URL** (e.g. `canvas.toDataURL('image/png')`) for the API request.
- **Optional but recommended:** Parent’s **email** and **child’s name** (for “send mentor by email” and for storing in the database). Collect these in the same step or immediately before/after the “Create my mentor” action (e.g. small form next to the canvas or in a modal).

### 3.3 UI steps (states)

Implement a small state machine for the **playground Draw section**:

1. **Draw** – Canvas visible, tools (colors, brush, eraser, undo, clear) and hint text (e.g. “Draw your mentor!”). Button: “Create my mentor” (or similar). Optional: email + child name fields.
2. **Generating** – After submit: hide canvas, show a single loading message (e.g. “Creating your mentor in Pixar style…”). Disable resubmit.
3. **Mentor ready** – Show the **generated character image** (from API response) and optionally the **original drawing** side by side. Optional: “Send to my email” (if email not already sent) and/or “Create a video” (if you implement video).
4. **Optional: Generating video** – If user requested video: show “Creating video…”.
5. **Optional: Video ready** – Show the video player and link or download.

On **error** (network or API error): return to **Draw** (or a dedicated error state), show a short, user-friendly error message (e.g. “Something went wrong. Try again.”), and do not leave the user stuck on “Generating”.

### 3.4 API usage from the frontend

- **Single primary request:** `POST /api/generate` with JSON body:
  - `imageBase64` (string, required): full data URL of the canvas PNG (e.g. `data:image/png;base64,...`).
  - `email` (string, optional): parent email.
  - `childName` (string, optional): child’s name.
  - `generateVideo` (boolean, optional): if `true`, backend will also generate a video (if you implement it).
  - `learningPrompt` (string, optional): topic for the video (e.g. “the solar system”), only used when `generateVideo` is true.

- **Response (success):** JSON with at least:
  - `characterImageUrl` (string): URL of the generated Pixar-style character image (hosted by FAL or your CDN).
  - `drawingDescription` (string): short label (e.g. “Pixar-style 3D character transformation”).
  - `videoUrl` (string or null): if video was requested and generated.

- **Response (error):** Non-2xx status and JSON with an `error` (string) and optionally `details`. Frontend should display the error and allow retry.

- **Optional second request (email):** After a successful generate, if the user provided an email and you want to send the result:
  - `POST /api/send-email` with JSON: `toEmail`, `childName`, `originalDrawing` (base64 data URL), `mentorImageUrl`. Your backend downloads or uses the mentor image and sends one email (e.g. via Resend) with the mentor image and optionally the original drawing attached or inlined. Return something like `{ success: true }` or `{ error: "..." }`.

---

## 4. Backend: `/api/generate` (drawing → character, optional video)

### 4.1 Contract

- **Input:** JSON body with `imageBase64` (required), and optionally `email`, `childName`, `generateVideo`, `learningPrompt`.
- **Output:** JSON with `characterImageUrl`, `drawingDescription`, and optionally `videoUrl`. On failure, return appropriate HTTP status (400 for bad input, 500 for server/AI errors) and a body with `error` and optionally `details`.

### 4.2 Steps inside the handler

1. **Validate env:** Ensure `FAL_KEY` is set; if not, return 500 with a clear message (e.g. “API key not configured”).
2. **Validate input:** If `imageBase64` is missing or empty, return 400.
3. **Optional fast path:** If the client sends an existing `characterImageUrl` and only wants a video (e.g. `characterImageUrl` + `generateVideo` + `learningPrompt`), skip the image-generation step and go directly to the video step below; then return the same structure with the new `videoUrl`.
4. **Drawing → character (image-to-image):**
   - Configure the FAL client with `FAL_KEY`.
   - Call the FAL **image-to-image / edit** model (e.g. `fal-ai/nano-banana-pro/edit` or the current equivalent) with:
     - **Input image:** the child’s drawing (pass `imageBase64` as the image; FAL typically accepts a data URL or `image_url` in the format they document).
     - **Prompt:** A single, detailed, fixed prompt in English that instructs the model to:
       - Treat the drawing as a blueprint: preserve silhouette, proportions, shape language, structure, and **exact color palette**.
       - Transform it into a **high-fidelity 3D mascot in Pixar animation style** (warm, charming, emotionally clear, cinematic).
       - Preserve all distinctive details (facial features, accessories, asymmetries).
       - Use soft, rounded 3D geometry; large, expressive eyes; friendly, readable personality.
       - Apply Pixar-style materials (soft fur, velvety textures, matte skin; no photorealism, no plastic look).
       - Use cinematic studio lighting (soft, flattering, gentle rim light), simple blurred background, character in a joyful pose.
       - Output a single, high-quality image (poster-like, 8K feel).
   - From the FAL response, read the **first output image URL** (e.g. `result.data.images[0].url` or the structure your model returns). This is `characterImageUrl`.
5. **Persist (optional but recommended):** Insert one row into the Supabase `drawings` table: `original_drawing` = `imageBase64`, `mentor_image_url` = `characterImageUrl`, `drawing_description` = a short label, `user_email` = request email or null, `child_name` = request child name or null, `created_at` = now. Use the Supabase client from the server; ignore or log DB errors but do not fail the request if insert fails (e.g. continue and still return the image URL).
6. **Optional video step:** If `generateVideo` is true and `learningPrompt` is non-empty and you have a `characterImageUrl`, call the FAL **image-to-video** model (e.g. `fal-ai/sora-2/image-to-video`) with:
   - **Input image:** `characterImageUrl`.
   - **Prompt:** A short, friendly prompt in English, e.g. “A cute animated mentor character teaching a child about [learningPrompt]. The character is friendly, gently animated, making small movements, looking at the viewer warmly. Educational children's video style, colorful background, engaging, fun learning moment.”
   - Read the output **video URL** from the response and set `videoUrl` in the JSON response. If this call fails, log the error and return `videoUrl: null` (do not fail the whole request).
7. **Respond:** Return 200 with JSON: `{ success: true, drawingDescription: "...", characterImageUrl: "...", videoUrl: "..." or null }`.

### 4.3 Error handling

- Catch FAL and Supabase errors. Log them server-side. Return 500 with a generic user-facing message (e.g. “Generation failed”) and optionally `details` for debugging. Never expose raw API keys or stack traces to the client.

---

## 5. Backend: `/api/send-email` (optional)

- **Input:** JSON with `toEmail`, `mentorImageUrl`, and optionally `childName`, `originalDrawing` (base64 data URL).
- **Logic:** Validate Resend key and required fields. Download the image from `mentorImageUrl` (or use base64 if you already have it). Optionally decode `originalDrawing` for an attachment. Compose an HTML email with a short, child-friendly title (e.g. “Your mentor is ready!”), embed or attach the mentor image, optionally attach the original drawing, and include a CTA link to your app. Send via Resend. Return `{ success: true }` or `{ success: false, error: "..." }`.
- **Security:** Rate-limit or require auth if this is public; avoid exposing Resend key to the client.

---

## 6. Database schema (Supabase)

Create a table (e.g. `drawings`) with at least:

- `id` – UUID, primary key, default `gen_random_uuid()`.
- `original_drawing` – TEXT (base64 data URL or URL to stored file).
- `mentor_image_url` – TEXT (URL of the generated character image).
- `drawing_description` – TEXT (e.g. “Pixar-style 3D character transformation”).
- `user_email` – TEXT, nullable.
- `child_name` – TEXT, nullable.
- `created_at` – TIMESTAMPTZ, default `now()`.

Enable RLS if needed; ensure the server uses credentials that can insert (e.g. service role or a dedicated role with insert permission).

---

## 7. Exact prompt text for drawing → character (reference)

Use this as the **single prompt** for the image-to-image call (no separate “describe the drawing” step):

```
Transform the attached hand-drawn character into a high-fidelity 3D mascot in authentic Pixar animation style. The final result should feel as if the character belongs inside a Pixar film universe, with warmth, charm, emotional clarity, and cinematic polish.

Treat the drawing as a strict blueprint. Carefully analyze the drawing before generating the 3D version and preserve the exact silhouette, proportions, shape language, and overall structure. Maintain the original color palette exactly as it appears in the drawing, without reinterpretation or stylistic recoloring. All distinctive details, including facial features, accessories, asymmetries, and unique marks, must remain faithful to the original design.

Identify whether the subject is an animal, human, object, or hybrid and recreate it using soft, rounded Pixar-style 3D geometry. The character should feature large, expressive Pixar-style eyes, subtle facial nuance, and a friendly, emotionally readable personality that matches the mood and intention of the original drawing.

All materials and textures must follow Pixar's stylized realism approach. Fur should appear soft and touchable, petals should feel velvety and layered, and skin should be smooth and matte with a handcrafted feel. Surfaces should look warm and premium, avoiding photorealism or plastic-like finishes while remaining believable and rich in detail.

Use Pixar-style cinematic studio lighting to bring the character to life. The lighting should be soft and flattering, similar to clamshell or butterfly lighting, with gentle global illumination and subtle rim light to separate the character from the background while maintaining a friendly, magical atmosphere.

Enhance the drawing with true 3D depth, soft shadows, and natural dimensionality while staying completely faithful to the original design. Pose the character in a joyful, welcoming, high-energy Pixar-style stance that reinforces personality without altering proportions or structure.

Render the final output as a professional Pixar-quality 3D character reveal with ultra-clean presentation and high detail. Use a simple, whimsical, softly blurred background so the mascot remains the clear focus. The final image should feel like a Pixar movie poster or character introduction, presented with cinematic polish and 8K-level clarity.
```

---

## 8. Summary checklist

- [ ] Canvas with colors, brush, eraser, undo, clear; mouse + touch; export PNG as base64.
- [ ] Optional email + child name; UI states: draw → generating → mentor ready (→ optional video states).
- [ ] `POST /api/generate`: validate FAL_KEY and imageBase64; call FAL image-to-image with the prompt above; persist to Supabase `drawings`; optionally call FAL image-to-video; return characterImageUrl and optional videoUrl.
- [ ] Optional `POST /api/send-email`: send mentor image (and optional original drawing) via Resend.
- [ ] Supabase table `drawings` with columns as above; RLS and server-side insert.
- [ ] Errors: user-friendly messages, no exposed keys or stack traces.

If you follow this prompt exactly, you will have the **Draw section of the web playground** implemented: a complete, production-style “draw → AI mentor character” pipeline that fits into the main product (playground on the web, with a dedicated Draw area).
