from app import app
import os

if __name__ == "__main__":
    # Port dynamique pour déploiement (Render, Heroku, etc.)
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    # Debug mode uniquement en local
    debug = os.environ.get("FLASK_ENV") != "production"
    
    # Désactiver use_reloader pour éviter les problèmes avec librosa
    app.run(host=host, port=port, debug=debug, use_reloader=False)