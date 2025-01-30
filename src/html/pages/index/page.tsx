import type { ResultType } from "~/db/schema";
import Form from "./components/form";
import ResultItem from "./components/result-item";

interface IndexProps {
  results: ResultType[];
}

export default function Index({ results }: IndexProps) {
  return (
    <main className="flex w-full flex-col items-center space-y-8 px-6 py-12 lg:pt-20">
      {/* TODO: change this */}
      <h1 className="text-center text-5xl font-bold">
        Separate vocals from music tracks
      </h1>
      <p className="max-w-lg text-center text-muted-foreground">
        Isolate vocals from music tracks with our AI-powered tool. Upload your
        audio file and let the magic happen.
      </p>
      <Form />
      <div className="flex w-full max-w-lg flex-col items-center">
        {results.map((result) => (
          <ResultItem initialData={result} key={result.id} />
        ))}
      </div>
    </main>
  );
}
