import uvicorn
import os

port = int(os.environ.get("PORT", 10000))

uvicorn.run("app.main:app", host="0.0.0.0", port=port)