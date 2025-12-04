from flask import render_template
from app import app



class IndexController:

    @app.route("/", methods=["GET"])
    def index():
        metadata = {
            'title':'🔉 Visualiseur'
            }

        return render_template('index.html',metadata = metadata)