from flask import Flask, request, send_file
import torch
from torch import autocast
from diffusers import StableDiffusionPipeline
from diffusers.utils import DIFFUSERS_CACHE

import io
import os
import logging

logging.info("Loading stable diffusion pipeline")
pipe = StableDiffusionPipeline.from_pretrained(
	"CompVis/stable-diffusion-v1-4",
	revision="fp16",
	torch_dtype=torch.float16,
	use_auth_token=os.environ["HF_TOKEN"],
	local_files_only=os.path.exists(DIFFUSERS_CACHE),
).to("cuda")
logging.info("Stable diffusion pipeline loaded")

app = Flask(__name__)

@app.route("/")
def index():
	return "Hello World!"

@app.route("/generate", methods=["POST"])
def generate():
	prompt = request.form["prompt"]
	with autocast("cuda"):
		image = pipe(prompt)["sample"][0]
		buf = io.BytesIO()
		image.save(buf, format="PNG")
		buf.seek(0)
	return send_file(buf, mimetype="image/png")

if __name__ == "__main__":
	app.run(debug=True)