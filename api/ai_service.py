import anthropic
import os
from schemas import OutfitResponse

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