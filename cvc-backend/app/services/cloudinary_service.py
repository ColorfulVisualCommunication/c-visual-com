import cloudinary.uploader
import cloudinary.exceptions
from flask import current_app

def upload_image_to_cloudinary(file, folder=None):
    folder = folder or current_app.config.get("CLOUDINARY_FOLDER", "cvisualcom")
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type="image"
        )
        return result["secure_url"]
    except cloudinary.exceptions.Error as e:
        current_app.logger.error(f"Cloudinary image upload failed: {e}")
        raise

def upload_avatar_to_cloudinary(file, user_id):
    try:
        result = cloudinary.uploader.upload(
            file,
            folder="cvisualcom/avatars",
            public_id=f"user_{user_id}_avatar",
            overwrite=True,
            transformation=[
                {"width": 300, "height": 300, "crop": "thumb", "gravity": "face", "radius": "max"}
            ]
        )
        return result["secure_url"]
    except cloudinary.exceptions.Error as e:
        current_app.logger.error(f"Cloudinary avatar upload failed: {e}")
        raise

def delete_avatar_from_cloudinary(user_id):
    public_id = f"cvisualcom/avatars/user_{user_id}_avatar"
    try:
        result = cloudinary.uploader.destroy(public_id)
        current_app.logger.info(f"Cloudinary avatar deletion result for {public_id}: {result}")
        return result
    except cloudinary.exceptions.Error as e:
        current_app.logger.error(f"Cloudinary avatar deletion failed: {e}")
        raise