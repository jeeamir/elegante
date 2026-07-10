import anthropic
import os
from schemas import OutfitResponse, WardrobeAnalysisResponse, OutfitFeedback
import base64
from fastapi import UploadFile

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def get_outfit_recommendation(profile, occasion, mood=None):

    schema = OutfitResponse.model_json_schema()

    prompt = f"""You are a personal stylist. Based on the client profile and occasion below, suggest ONE complete outfit.

    CLIENT PROFILE:
    - Gender: {profile.gender}
    - Height: {profile.height} {profile.height_unit}, Weight: {profile.weight} {profile.weight_unit}, Body type: {profile.body_type}, Shoe size: {profile.shoe_size} ({profile.shoe_size_system})
    - Lifestyle: {profile.lifestyle}
    - Style: {profile.preferred_style}
    - Colors: {', '.join(profile.favourite_colors)}
    - Budget: {profile.budget}
    - Shops: {', '.join(profile.favourite_shops)}

    OCCASION: {occasion}
    MOOD: {mood if mood else "not specified"}

    Keep each line under 20 words. No greetings, no emojis, no closing remarks."""


    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1200,
        messages=[{"role": "user", "content": prompt}],
        tools=[
            {
                "name": "suggest_outfit",
                "description": "Suggest outfit based on my profile and my occasion",
                "input_schema": schema
            }
        ],
        tool_choice={"type": "tool", "name": "suggest_outfit"}
    )

    return message.content[0].input


async def encode_image(file: UploadFile) -> tuple[str, str]:
    contents = await file.read()
    base64_string = base64.b64encode(contents).decode("utf-8")
    media_type = file.content_type

    return (base64_string, media_type)


def get_photo_feedback(profile, occasion, base64_image, media_type):

    schema = OutfitFeedback.model_json_schema()

    prompt = f"""You are a personal stylist. Analyze this outfit photo for the client below and the occasion.

    CLIENT PROFILE:
    - Gender: {profile.gender}
    - Body type: {profile.body_type}
    - Style: {profile.preferred_style}

    OCCASION: {occasion}

    Evaluate fit, color coordination, and overall appropriateness for the occasion. Be honest and specific."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": base64_image
                        }
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ],
        tools=[
            {
                "name": "provide_feedback",
                "description": "Provide structured feedback on the outfit photo",
                "input_schema": schema
            }
        ],
        tool_choice={"type": "tool", "name": "provide_feedback"}
    )

    return message.content[0].input

def get_wardrobe_analysis(profile, base64_image, media_type):

    schema = WardrobeAnalysisResponse.model_json_schema()

    prompt = f"""You are a professional stylist. You have to define clothes that person is wearing and split them into categories with related colour, fit, style, ocassion"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": base64_image,
                        },
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ],
        tools=[
            {
                "name": "analyze_wardrobe",
                "description": "Analyze and define clothes from the photo",
                "input_schema": schema
            }
        ],
        tool_choice={"type": "tool", "name": "analyze_wardrobe"}
    )

    return message.content[0].input


