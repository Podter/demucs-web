from cog import BasePredictor, Input, Path
import tempfile
import torchaudio
import torch

from demucs_infer.pretrained import get_model
from demucs_infer.repo import AnyModel
from demucs_infer.apply import apply_model
from demucs_infer.audio import save_audio

MODELS = ["htdemucs", "htdemucs_ft", "htdemucs_6s"]


class Predictor(BasePredictor):
    models: dict[str, AnyModel] = {}
    device: str = (
        "cuda"
        if torch.cuda.is_available()
        else "mps" if torch.mps.is_available() else "cpu"
    )

    def setup(self) -> None:  # pyright: ignore[reportIncompatibleMethodOverride]
        print(f"Using device: {self.device}")
        for model_name in MODELS:
            model = get_model(model_name)
            model = model.to(self.device)
            model.eval()
            self.models[model_name] = model

    def predict(  # pyright: ignore[reportIncompatibleMethodOverride]
        self,
        audio_file: Path = Input(description="The audio file to separate"),
        model_name: str = Input(
            description="Model to use for separation",
            choices=MODELS,  # pyright: ignore[reportArgumentType]
        ),
    ) -> dict[str, Path]:
        model = self.models[model_name]

        audio, sr = torchaudio.load(audio_file)
        audio = audio.unsqueeze(0).to(self.device)  # Add batch dimension

        with torch.no_grad():
            outputs = apply_model(model, audio, progress=True, device=self.device)

        out_dir = Path(tempfile.mkdtemp())
        out_files: dict[str, Path] = {}

        for i, source_name in enumerate(model.sources):
            out_file = out_dir / f"{source_name}.mp3"
            output = outputs[0, i].cpu()  # Remove batch dimension
            save_audio(output, out_file, sr)
            out_files[source_name] = out_file

        return out_files
