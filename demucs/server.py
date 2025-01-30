from demucs.separate import main as separate
from litserve import LitAPI, LitServer
from typing import TypedDict
import requests
import os
import shutil

# MODEL = "htdemucs_ft"
# MODEL = "htdemucs"
MODEL = os.getenv("MODEL", "htdemucs")
MP3_BITRATE = 320
MP3_QUALITY = 2
API_URL = os.getenv("API_URL", "http://localhost:3000")


class DemucsInput(TypedDict):
    id: str
    folder_path: str
    file_path: str
    two_stems: bool
    hash: str


class DemucsOutput(TypedDict):
    success: bool
    id: str
    folder_path: str
    hash: str


class DemucsAPI(LitAPI):
    device: str

    def setup(self, device: str):
        self.device = device
        pass

    def decode_request(self, request: dict) -> DemucsInput:
        id: str = request["id"]
        filename: str = request["filename"]
        two_stems: bool = request["two_stems"]
        hash: str = request["hash"]

        folder_path: str = f"tmp/{id}"
        file_path: str = f"{folder_path}/{filename}"
        os.makedirs(folder_path, exist_ok=True)

        response = requests.get(
            f"{API_URL}/file/{id}/{filename}",
            headers={"Authorization": f"Bearer {hash}"},
        )
        with open(file_path, "wb") as file:
            file.write(response.content)

        return {
            "id": id,
            "folder_path": folder_path,
            "file_path": file_path,
            "two_stems": two_stems,
            "hash": hash,
        }

    def predict(self, input: DemucsInput) -> DemucsOutput:
        id: str = input["id"]
        folder_path: str = input["folder_path"]
        file_path: str = input["file_path"]
        two_stems: bool = input["two_stems"]
        hash: str = input["hash"]

        success: bool = False

        try:
            args: list[str] = [
                # File path
                file_path,
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
                # Output
                "--out",
                folder_path,
                # Filename format
                "--filename",
                "{stem}.{ext}",
            ]

            # Two stems
            if two_stems:
                args.append("--two-stems")
                args.append("vocals")

            # Run
            separate(args)
            success = True
        except Exception as e:
            print(e)
            success = False

        return {
            "success": success,
            "id": id,
            "folder_path": folder_path,
            "hash": hash,
        }

    def encode_response(self, output: DemucsOutput) -> dict:
        success: bool = output["success"]
        id: str = output["id"]
        folder_path: str = output["folder_path"]
        hash: str = output["hash"]

        try:
            output_folder: str = f"{folder_path}/{MODEL}"
            files = os.listdir(output_folder)
            for filename in files:
                file_path = f"{output_folder}/{filename}"
                with open(file_path, "rb") as file:
                    requests.post(
                        f"{API_URL}/file/{id}/{filename}",
                        files={"file": file},
                        headers={"Authorization": f"Bearer {hash}"},
                    )
            shutil.rmtree(folder_path)
            success = True
        except Exception as e:
            print(e)
            success = False

        requests.post(
            f"{API_URL}/api/result/{id}",
            json={"success": success},
            headers={"Authorization": f"Bearer {hash}"},
        )

        return {"id": id, "success": success}


if __name__ == "__main__":
    api = DemucsAPI()
    server = LitServer(api, devices="auto", timeout=3600)
    server.run(port=8000)
