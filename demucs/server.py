from demucs.separate import main as separate
from litserve import LitAPI, LitServer
from typing import TypedDict

# MODEL = "htdemucs_ft"
MODEL = "htdemucs"
MP3_BITRATE = 320
MP3_QUALITY = 2


class DemucsInput(TypedDict):
    file_path: str
    two_stems: bool


class DemucsOutput(TypedDict):
    success: bool


class DemucsAPI(LitAPI):
    device: str

    def setup(self, device: str):
        self.device = device
        pass

    def decode_request(self, request: dict) -> DemucsInput:
        return {
            "file_path": request["file_path"],
            "two_stems": request["two_stems"],
        }

    def predict(self, input: DemucsInput) -> DemucsOutput:
        args: list[str] = [
            # File path
            input["file_path"],
            # Model name
            "--name",
            MODEL,
            # Device
            "--device",
            self.device,
            # MP3
            "--mp3",
            # Bitrate
            "--mp3-bitrate",
            str(MP3_BITRATE),
            # Quality
            "--mp3-preset",
            str(MP3_QUALITY),
        ]

        # Two stems
        if input["two_stems"]:
            args.append("--two-stems")
            args.append("vocals")

        # Run
        separate(args)

        return {"success": True}

    def encode_response(self, output: DemucsOutput) -> dict:
        return {"success": output["success"]}


if __name__ == "__main__":
    api = DemucsAPI()
    server = LitServer(api, devices="auto", timeout=3600)
    server.run(port=8000)
