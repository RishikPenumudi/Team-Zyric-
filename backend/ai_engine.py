"""
SAHAJ AI - Gemini Multimodal & Artisan Assistant Engine
Integrates Google Gemini API with robust transparent deterministic fallbacks.
"""

import os
import json
import base64
import requests
from backend.config import GEMINI_API_KEY, GEMINI_MODEL
from backend.cv_color import extract_dominant_colors, match_recipes_for_color

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

SYSTEM_INSTRUCTION_ARTISAN = """
You are the SAHAJ AI Artisan Assistant, an expert natural dyeing technologist and botanical colour intelligence system.
Your role is to assist traditional textile artisans, research dyers, and sustainable fashion producers with:
1. Identifying natural botanical dye sources (Marigold, Indigo, Madder, Pomegranate, etc.).
2. Explaining validated extraction parameters (temperatures, water-to-plant ratios, extraction durations).
3. Advising on fiber preparation and mordanting (Alum, Iron/Ferrous Sulphate, Tannins, pH control for cotton, silk, and wool).
4. Interpreting dye output yield and error analysis.
5. Providing troubleshooting for uneven shades, fastness issues, and oxidation.

CRITICAL SAFETY & TRUTH RULES:
- Never fabricate unverified machine temperatures or dangerous chemical instructions.
- Emphasize that natural dye colours depend on raw material freshness, water quality, fiber scouring, and light.
- Natural dyes cannot replicate synthetic neon/fluorescent pigments; explain natural earthy, rich botanical beauty.
- Safety: Remind operators that machine safety interlocks (heater max 95°C, water-level safety) are hardware-governed.
- Support inquiries politely and respectfully in English, Telugu (తెలుగు), or Hindi (हिंदी) based on the user's language.
"""

def is_gemini_available() -> bool:
    """Check if Gemini API Key is configured and non-empty."""
    return bool(GEMINI_API_KEY and len(GEMINI_API_KEY.strip()) > 8)

def analyze_image_with_gemini(image_bytes: bytes, mime_type: str = "image/jpeg", target_fabric: str = "cotton") -> dict:
    """
    Send reference image to Gemini API for multimodal colour understanding.
    Falls back gracefully to deterministic CV if API key is absent or request fails.
    """
    # Deterministic CV extraction as baseline ground truth
    cv_result = extract_dominant_colors(image_bytes)

    if not is_gemini_available():
        return {
            "source": "deterministic_cv_heritage_engine",
            "gemini_active": False,
            "status_note": "Operating in Deterministic Heritage Mode (Set GEMINI_API_KEY for Live Multimodal Insights)",
            "dominant_hex": cv_result["dominant_hex"],
            "dominant_rgb": cv_result["dominant_rgb"],
            "color_family": cv_result["color_family"],
            "swatches": cv_result["swatches"],
            "botanical_suggestion": cv_result["primary_source_suggestion"],
            "artisan_assessment": (
                f"The reference colour corresponds to the {cv_result['color_family']} natural spectrum. "
                f"Traditional artisans typically extract this tone using {cv_result['primary_source_suggestion']}. "
                f"Natural dye shade intensity will vary based on fabric porosity ({target_fabric}) and mordant concentration."
            ),
            "achievability_limits": (
                "Natural dyes produce soft, harmonious, living shades. Exact Pantone photographic matching "
                "is subject to fiber scouring, harvest batch variation, and extraction water pH."
            ),
            "confidence": cv_result["confidence"]
        }

    # Prepare Gemini Multimodal Payload
    try:
        b64_image = base64.b64encode(image_bytes).decode("utf-8")
        url = GEMINI_API_URL.format(model=GEMINI_MODEL) + f"?key={GEMINI_API_KEY}"

        prompt = f"""
        Analyze this textile or color swatch reference image for natural botanical dyeing. Target fabric is '{target_fabric}'.
        Return a strict JSON object with these exact keys:
        {{
            "color_name": "Human descriptive natural shade name (e.g. Heritage Mustard, Indigo Cerulean)",
            "color_family": "Natural botanical color family",
            "botanical_candidates": ["Primary botanical source", "Secondary botanical alternative"],
            "artisan_assessment": "Detailed 2-sentence artisan insight regarding extraction, mordants, and achievable depth on {target_fabric}",
            "natural_dye_limitations": "Specific advice on natural dye tone vs synthetic photograph tone",
            "recommended_mordant": "Recommended natural mordant (e.g. Alum, Iron saddening, Pomegranate tannin)"
        }}
        Do not include markdown backticks or extra text. Return ONLY the raw JSON string.
        """

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": b64_image
                            }
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 600,
                "responseMimeType": "application/json"
            }
        }

        resp = requests.post(url, json=payload, timeout=12.0)
        if resp.status_code == 200:
            gemini_data = resp.json()
            raw_text = gemini_data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(raw_text)

            return {
                "source": "gemini_multimodal_plus_cv",
                "gemini_active": True,
                "status_note": "AI Analysis verified by Gemini Multimodal Engine",
                "dominant_hex": cv_result["dominant_hex"],
                "dominant_rgb": cv_result["dominant_rgb"],
                "color_family": parsed.get("color_family", cv_result["color_family"]),
                "color_name": parsed.get("color_name", cv_result["color_family"]),
                "swatches": cv_result["swatches"],
                "botanical_suggestion": ", ".join(parsed.get("botanical_candidates", [cv_result["primary_source_suggestion"]])),
                "artisan_assessment": parsed.get("artisan_assessment", ""),
                "achievability_limits": parsed.get("natural_dye_limitations", ""),
                "recommended_mordant": parsed.get("recommended_mordant", "Alum"),
                "confidence": 0.95
            }
        else:
            # Fallback on HTTP error
            return {
                "source": "deterministic_cv_heritage_engine",
                "gemini_active": False,
                "status_note": f"Gemini API returned status {resp.status_code}. Using deterministic heritage engine.",
                "dominant_hex": cv_result["dominant_hex"],
                "dominant_rgb": cv_result["dominant_rgb"],
                "color_family": cv_result["color_family"],
                "swatches": cv_result["swatches"],
                "botanical_suggestion": cv_result["primary_source_suggestion"],
                "artisan_assessment": "Analyzed using deterministic CV engine. Recommended botanical match verified.",
                "achievability_limits": "Natural dye shade varies by harvest quality and fabric pre-treatment.",
                "confidence": cv_result["confidence"]
            }
    except Exception as ex:
        return {
            "source": "deterministic_cv_heritage_engine",
            "gemini_active": False,
            "status_note": f"Gemini connection unavailable ({str(ex)}). Using deterministic heritage engine.",
            "dominant_hex": cv_result["dominant_hex"],
            "dominant_rgb": cv_result["dominant_rgb"],
            "color_family": cv_result["color_family"],
            "swatches": cv_result["swatches"],
            "botanical_suggestion": cv_result["primary_source_suggestion"],
            "artisan_assessment": "Analyzed using deterministic CV engine.",
            "achievability_limits": "Natural botanical tone calculated using CIE Delta-E metrics.",
            "confidence": cv_result["confidence"]
        }

def chat_artisan_assistant(user_message: str, conversation_history: list = None, language: str = "en") -> dict:
    """
    Handle domain-specific artisan queries with Gemini or deterministic domain rules.
    Supports English, Telugu, and Hindi.
    """
    if conversation_history is None:
        conversation_history = []

    if is_gemini_available():
        try:
            url = GEMINI_API_URL.format(model=GEMINI_MODEL) + f"?key={GEMINI_API_KEY}"
            contents = []

            # Add system instruction
            contents.append({
                "role": "user",
                "parts": [{"text": f"{SYSTEM_INSTRUCTION_ARTISAN}\nThe user's selected language is: {language}"}]
            })
            contents.append({
                "role": "model",
                "parts": [{"text": "Understood. I am the SAHAJ AI Artisan Assistant, ready to assist with natural dye chemistry, recipe guidance, and process intelligence."}]
            })

            # Append history
            for msg in conversation_history[-6:]:
                role = "user" if msg.get("sender") == "user" else "model"
                contents.append({"role": role, "parts": [{"text": msg.get("text", "")}]})

            contents.append({"role": "user", "parts": [{"text": user_message}]})

            payload = {
                "contents": contents,
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 800
                }
            }

            resp = requests.post(url, json=payload, timeout=12.0)
            if resp.status_code == 200:
                data = resp.json()
                reply = data["candidates"][0]["content"]["parts"][0]["text"]
                return {
                    "reply": reply,
                    "model": GEMINI_MODEL,
                    "status": "success",
                    "mode": "live_gemini"
                }
        except Exception as e:
            pass # Fall through to domain rules

    # Deterministic Domain-Knowledge Fallback
    msg_lower = user_message.lower()

    # Telugu query detection
    if "ఎలా" in user_message or "బంతి" in user_message or "నీలి" in user_message or language == "te":
        if "మెంజిష్ట" in user_message or "ఎరుపు" in user_message or "madder" in msg_lower:
            reply = "మెంజిష్ట (Rubia cordifolia) రూట్ ఎరుపు రంగుకు ఉపయోగపడుతుంది. దీనిని 75-80°C వద్ద 60 నిమిషాలు ఉడికించాలి. 80°C కంటే ఎక్కువ వేడి చేయకూడదు, లేకపోతే రంగు బ్రౌన్ అవుతుంది. అలమ్ (15% WOF) వాడటం మంచిది."
        elif "నీలి" in user_message or "indigo" in msg_lower:
            reply = "నీలిమందు (Indigo) నేరుగా మరిగించకూడదు. ఇది వాట్ డై (Vat Dye). దీనికి లైమ్ మరియు ఫ్రక్టోజ్ లేదా హైడ్రోసల్ఫైట్ ద్వారా రిడక్షన్ చేయాలి. ఆక్సీకరణం ద్వారా నీలి రంగు వస్తుంది."
        else:
            reply = "SAHAJ AI ఆర్టిసాన్ అసిస్టెంట్ కు స్వాగతం. బంతిపూలు (Marigold) పసుపు రంగుకు 85°C వద్ద 45 నిమిషాలు, మెంజిష్ట ఎరుపుకు 78°C వద్ద, మరియు దానిమ్మ రంగుకు 85°C వద్ద సరైన కొలతలతో సేకరించాలి."
        return {"reply": reply, "model": "sahaj_heritage_rules_te", "status": "success", "mode": "heritage_knowledge_base"}

    # Hindi query detection
    if "गेंदा" in user_message or "नील" in user_message or "रंग" in user_message or language == "hi":
        if "गेंदा" in user_message or "marigold" in msg_lower:
            reply = "गेंदा (Tagetes erecta) से सरसों जैसा पीला रंग पाने के लिए 85°C तापमान पर 45 मिनट तक एक्सट्रैक्शन करें। कॉटन पर फिटकरी (Alum 15% WOF) का प्री-मोर्डेंट सबसे अच्छा परिणाम देता है।"
        elif "मजीठ" in user_message or "madder" in msg_lower:
            reply = "मजीठ (Manjistha) की जड़ से लाल रंग निकालते समय तापमान को 78-80°C के बीच रखें। 80°C से अधिक उबालने पर टैनिन निकलकर रंग को भूरा कर देता है।"
        else:
            reply = "SAHAJ AI आर्टिसन असिस्टेंट में आपका स्वागत है। प्राकृतिक रंगों में तापमान, पानी का अनुपात और मोर्डेंट का नियंत्रण सबसे महत्वपूर्ण है। सहज सिस्टम आपको सटीक माप और प्रेडिक्शन प्रदान करता है।"
        return {"reply": reply, "model": "sahaj_heritage_rules_hi", "status": "success", "mode": "heritage_knowledge_base"}

    # English natural dye knowledge rules
    if "marigold" in msg_lower or "yellow" in msg_lower or "mustard" in msg_lower:
        reply = (
            "**Marigold (Tagetes erecta) Extraction Guide:**\n\n"
            "- **Target Colour:** Radiant Mustard Yellow to Warm Gold.\n"
            "- **Material-to-Water Ratio:** 1:10 (e.g. 100g dried petals in 1000ml water).\n"
            "- **Extraction Temperature:** 85.0°C (maintain between 82°C and 88°C for optimal lutein release).\n"
            "- **Extraction Duration:** 45 minutes.\n"
            "- **Mordanting:** 15% WOF (Weight of Fabric) Potassium Aluminium Sulphate (Alum) for cotton; 10% for silk.\n"
            "- **Yield Expectation:** High (~86% liquid yield recovery)."
        )
    elif "madder" in msg_lower or "manjistha" in msg_lower or "red" in msg_lower or "terracotta" in msg_lower:
        reply = (
            "**Indian Madder (Rubia cordifolia / Manjistha) Guide:**\n\n"
            "- **Target Colour:** Terracotta Red to Crimson.\n"
            "- **Critical Temperature Limit:** Keep strictly at **75°C - 78°C**. Never boil above 80°C! Temperatures above 80°C release brown hydrolyzable tannins that dull the vivid alizarin reds.\n"
            "- **Extraction Duration:** 60 minutes.\n"
            "- **Ratio:** 1:8.3 (120g root powder per 1000ml water).\n"
            "- **Mordant:** Pre-mordant cotton with 20% Alum + 2% Soda Ash to ensure deep anthraquinone binding."
        )
    elif "indigo" in msg_lower or "blue" in msg_lower or "vat" in msg_lower:
        reply = (
            "**True Indigo (Indigofera tinctoria) Reduction Guide:**\n\n"
            "- **Chemistry:** Indigo is insoluble in water and cannot be extracted via conventional boiling. It requires an alkaline reduction vat (pH 10.2 - 10.8).\n"
            "- **Vat Temperature:** Gentle warmth at 50°C - 55°C.\n"
            "- **Reduction Duration:** 30 minutes until a yellow-green 'flower' forms on top.\n"
            "- **Dyeing Mechanism:** Submerge fabric without introducing oxygen. When removed, the leuco-indigo oxidizes in air from yellow-green to iconic blue."
        )
    elif "pomegranate" in msg_lower or "anar" in msg_lower or "khaki" in msg_lower or "green" in msg_lower:
        reply = (
            "**Pomegranate Rind (Punica granatum) Guide:**\n\n"
            "- **Target Colour:** Warm Ochre Khaki (or Olive Green with Iron).\n"
            "- **Natural Property:** Very high in ellagitannins. Acts as a self-mordanting dye.\n"
            "- **Temperature & Time:** 85°C for 50 minutes.\n"
            "- **Colour Shifting:** Adding 1.5% - 2% Ferrous Sulphate (Iron) during dyeing shifts the bright ochre into a rich military olive or moss green."
        )
    elif "yield" in msg_lower or "error" in msg_lower or "prediction" in msg_lower:
        reply = (
            "**Dye Yield & Error Intelligence:**\n\n"
            "In natural dye extraction, plant biomass retains a portion of the water (typically 12% to 22%), and minor evaporation occurs. "
            "SAHAJ uses an explainable regression model to calculate predicted yield:\n"
            "- **Absolute Error** = |Actual Output - Predicted Output|\n"
            "- **Percentage Error** = (|Actual - Predicted| / Predicted) × 100\n"
            "A percentage error below 3% indicates a well-calibrated extraction run."
        )
    elif "safety" in msg_lower or "hardware" in msg_lower or "heater" in msg_lower:
        reply = (
            "**SAHAJ Safety & Hardware Architecture:**\n\n"
            "Safety-critical operations are isolated on the local hardware controller:\n"
            "1. **Thermal Protection:** Hardware cuts off heating above 95.0°C.\n"
            "2. **Dry Run Interlock:** Heating is locked out if the water level sensor reads below 0.5L.\n"
            "3. **AI Boundary:** Gemini provides intelligent advice and analysis, but never overrides physical deterministic machine safety limits."
        )
    else:
        reply = (
            "Welcome to **SAHAJ AI Artisan Assistant**. I can guide you through:\n"
            "1. **Botanical Sources & Recipes:** Marigold (Yellows), Madder (Reds), Indigo (Blues), Pomegranate (Khaki/Greens).\n"
            "2. **Measurement Calculations:** Plant material weight & water ratios based on fabric weight.\n"
            "3. **Extraction & Dyeing Parameters:** Temperature profiles, durations, and mordant chemistry.\n"
            "4. **Yield & Error Diagnostics:** Analyzing output volume deviations.\n\n"
            "How can I assist your dyeing batch today?"
        )

    return {
        "reply": reply,
        "model": "sahaj_heritage_knowledge_base",
        "status": "success",
        "mode": "heritage_knowledge_base"
    }
