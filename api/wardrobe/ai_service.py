import anthropic
import os
import base64
from fastapi import UploadFile
from PIL import Image
import pillow_heif
import io
from .schemas import WardrobeAnalysisResponse, WardrobeItemAnalysis
pillow_heif.register_heif_opener()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def get_wardrobe_analysis(base64_image, media_type):

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