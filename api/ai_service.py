import anthropic
import os

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def get_outfit_recommendation(profile, occasion, mood=None):
    prompt = f"""You are a personal stylist. Based on the client profile and occasion below, suggest ONE complete outfit.

    CLIENT PROFILE:
    - Gender: {profile.gender}
    - Height: {profile.height} cm, Weight: {profile.weight} kg, Body type: {profile.body_type}
    - Lifestyle: {profile.lifestyle}
    - Style: {profile.preferred_style}
    - Colors: {', '.join(profile.favourite_colors)}
    - Budget: {profile.budget}
    - Shops: {', '.join(profile.favourite_shops)}

    OCCASION: {occasion}
    MOOD: {mood if mood else "not specified"}

    OUTPUT FORMAT (strict, no intro, no fluff, no markdown headers):
    Top: [item, color, why]
    Bottom: [item, color, why]
    Shoes: [item, color, why]
    Accessory: [item, color, why]

    Keep each line under 20 words. No greetings, no emojis, no closing remarks."""


    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1200,
        messages=[{"role": "user", "content": prompt}]
    )

    return message