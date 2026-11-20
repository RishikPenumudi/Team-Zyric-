# Google Cloud Deployment Guide — SAHAJ AI

This guide provides step-by-step instructions to deploy **SAHAJ AI** onto **Google Cloud** using **Google Cloud Run** (Serverless Container Platform).

---

## Option 1: Direct GitHub Continuous Deployment (100% via Browser UI)

This is the recommended approach for the Google Cloud Startup Buildathon. Any new push to your GitHub `main` branch will automatically re-deploy your app.

### Step 1: Open Google Cloud Run Console
1. Log in to [Google Cloud Console](https://console.cloud.google.com/).
2. In the top search bar, type **Cloud Run** or go directly to [console.cloud.google.com/run](https://console.cloud.google.com/run).
3. Ensure your project is selected in the project dropdown at the top.

### Step 2: Create Service
1. Click the **Create Service** button.
2. Select **Continuously deploy from a repository**.
3. Click **SET UP WITH CLOUD BUILD**:
   - **Repository Provider:** GitHub
   - If prompted, authorize Google Cloud to access your GitHub account.
   - **Repository:** `RishikPenumudi/Team-Zyric-`
   - Click **Next**.
   - **Branch:** `^main$`
   - **Build Type:** Select **Dockerfile**
   - **Source location:** `/Dockerfile`
   - Click **Save**.

### Step 3: Configure Service Settings
1. **Service name:** `sahaj-ai`
2. **Region:** Select `asia-south1 (Mumbai)` (ideal for India) or `us-central1`.
3. **Authentication:** Select **Allow unauthenticated invocations** (enables public access to your web app).
4. Expand **Container, Networking, Security**:
   - **Container port:** `8080` (matches Dockerfile and Starlette config).
   - Under **Environment variables**, click **Add Variable**:
     - Name: `SAHAJ_HARDWARE_MODE`, Value: `SIMULATION`
     - Name: `GEMINI_API_KEY`, Value: `[YOUR_GEMINI_API_KEY]` *(from Google AI Studio)*
   - **Memory:** `1 GiB` or `2 GiB`
   - **CPU:** `1`
5. Click **Create**!

Cloud Build will automatically compile your Docker image, push it to Artifact Registry, and launch your container. In approximately 2 minutes, your live production HTTPS URL will appear at the top of the page (e.g., `https://sahaj-ai-xxxxxx.a.run.app`).

---

## Option 2: 1-Command Deployment via Google Cloud Shell

If you are already inside Google Cloud Console, Google Cloud Shell provides a free in-browser terminal with all Google Cloud SDKs pre-installed.

1. Click the **Activate Cloud Shell** icon (`>_`) in the top-right header of Google Cloud Console.
2. Run the following commands in the Cloud Shell terminal:

```bash
# 1. Clone your repository
git clone https://github.com/RishikPenumudi/Team-Zyric-.git
cd Team-Zyric-

# 2. Deploy directly to Cloud Run from source
gcloud run deploy sahaj-ai \
    --source . \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars SAHAJ_HARDWARE_MODE=SIMULATION
```

When prompted:
- **Enable required APIs (Cloud Run, Cloud Build, Artifact Registry):** Press `y`.
- Cloud Run will build the container image and display your live URL:
```
Service [sahaj-ai] revision [sahaj-ai-00001-xxx] has been deployed and is serving 100 percent of traffic.
Service URL: https://sahaj-ai-abcdef123-uc.a.run.app
```

---

## Option 3: Automated Google Cloud Build Pipeline (`cloudbuild.yaml`)

This repository includes a pre-configured `cloudbuild.yaml` file:

```bash
# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

---

## Verifying Deployment Health
Once deployed, verify your endpoints:
- **Web UI:** Navigate to `https://[YOUR_SERVICE_URL]`
- **System Health API:** `https://[YOUR_SERVICE_URL]/api/system/status`
- **Recipe Catalog:** `https://[YOUR_SERVICE_URL]/api/recipes`
- **Artisan Assistant:** Interact directly in English, Telugu, or Hindi on the live site!
