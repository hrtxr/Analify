import os, glob

__all__ = [os.path.basename(f)[:-3] for f in glob.glob(os.path.dirname(__file__) + "/*.py")]

from flask import Flask

app = Flask(__name__, static_url_path='/static')

from app.controllers import *