"use client";
import { MatrixColumnsPlayground } from "./MatrixColumnsPlayground";
import { LinePlayground } from "./LinePlayground";
import { RREFPlayground } from "./RREFPlayground";
import { VectorArrowPlayground } from "./VectorArrowPlayground";
import { AddScalePlayground } from "./AddScalePlayground";
import { SpanPlayground } from "./SpanPlayground";
import { IndependencePlayground } from "./IndependencePlayground";
import { EigenPlayground } from "./EigenPlayground";
import { SVDPlayground } from "./SVDPlayground";
import { SVDImagePlayground } from "./SVDImagePlayground";
import { PCAPlayground } from "./PCAPlayground";
import { LeastSquaresPlayground } from "./LeastSquaresPlayground";
import type { PlaygroundId } from "@/lib/curriculum";
import { m2 } from "@/lib/math";

export function Playground({ id }: { id: PlaygroundId }) {
  switch (id) {
    case "lines-2d":
    case "intersect":
      return <LinePlayground />;
    case "rref":
      return <RREFPlayground />;
    case "vector-arrow":
      return <VectorArrowPlayground />;
    case "add-scale":
      return <AddScalePlayground />;
    case "span":
      return <SpanPlayground />;
    case "independence":
      return <IndependencePlayground />;
    case "matrix-cols":
    case "matrix-times-vec":
    case "matrix-times-mat":
    case "big-four":
    case "determinant":
    case "inverse":
    case "rank":
    case "null-range":
      return <MatrixColumnsPlayground />;
    case "four-subspaces":
      return <FourSubspacesPlayground />;
    case "dual":
    case "annihilator":
    case "transpose":
      return <DualPlayground />;
    case "eigen-discover":
    case "eigenvalue":
    case "characteristic":
    case "diagonalize":
      return <EigenPlayground />;
    case "svd-animate":
      return <SVDPlayground />;
    case "svd-image":
      return <SVDImagePlayground />;
    case "pca":
      return <PCAPlayground />;
    case "least-squares":
      return <LeastSquaresPlayground />;
    default:
      return (
        <div className="bg-card border border-line rounded-xl p-8 text-center text-dim">
          Playground coming soon for: {id}
        </div>
      );
  }
}

function FourSubspacesPlayground() {
  return (
    <div className="bg-card border border-line rounded-xl p-6">
      <h3 className="text-sm font-medium text-ink mb-2">The four fundamental subspaces</h3>
      <p className="text-xs text-dim mb-4">
        For any matrix A, there are four subspaces — in two pairs of annihilators.
        This playground is being polished. For now, the matrix-columns playground above
        shows the action of A; the null space is what collapses to zero, the column
        space is what&apos;s reachable.
      </p>
    </div>
  );
}

function DualPlayground() {
  return (
    <div className="bg-card border border-line rounded-xl p-6">
      <h3 className="text-sm font-medium text-ink mb-2">Linear functionals & dual space</h3>
      <p className="text-xs text-dim">
        A linear functional is a linear map f: V → ℝ. The dot product is the classic
        example: f(v) = v · w for some fixed w. The set of ALL such functionals is
        the dual space V*. It has the same dimension as V but is a different kind of
        object — functionals, not vectors. See the matrix playground for the transpose
        of a transformation, which is the map on functionals.
      </p>
    </div>
  );
}
