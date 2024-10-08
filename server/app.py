from . import create_app
import logging

app = create_app()

if __name__ == "__main__":
    logging.debug("Starting app")
    app.run(host='0.0.0.0', port=8080)
