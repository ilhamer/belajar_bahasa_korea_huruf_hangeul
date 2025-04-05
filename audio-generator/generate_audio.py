import os
import json
import re
from gtts import gTTS
import time

def sanitize_filename(text):
    """Ganti karakter ilegal dalam nama file"""
    return re.sub(r'[\\/*?:"<>|]', "_", text)

def generate_audio():
    # Konfigurasi path
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    INPUT_JSON = os.path.join(BASE_DIR, "data", "hangeul.json")
    OUTPUT_DIR = os.path.join(BASE_DIR, "audio", "korean")
    
    try:
        # Baca data JSON
        with open(INPUT_JSON, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        # Buat folder output
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        for item in data:
            # Generate nama file yang aman
            safe_name = sanitize_filename(item["romanisasi"])
            output_path = os.path.join(OUTPUT_DIR, f"{safe_name}.mp3")
            
            if os.path.exists(output_path):
                print(f"✅ Audio sudah ada: {safe_name}.mp3")
                continue
                
            print(f"🔈 Membuat audio untuk: {item['karakter']} ({safe_name})")
            tts = gTTS(text=item["karakter"], lang="ko")
            tts.save(output_path)
            time.sleep(1)  # Delay untuk hindari rate limiting
            
            # Update path audio di data
            item["audio"] = os.path.join("audio", "korean", f"{safe_name}.mp3").replace("\\", "/")
        
        # Simpan JSON dengan path audio yang diperbarui
        with open(INPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print("🎉 Semua audio berhasil digenerate!")
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    generate_audio()