"use client";
import dynamic from "next/dynamic";
import { MatrixColumnsPlayground } from "./MatrixColumnsPlayground";
import { LinePlayground } from "./LinePlayground";
import { RREFPlayground } from "./RREFPlayground";
import { VectorArrowPlayground } from "./VectorArrowPlayground";
import { AddScalePlayground } from "./AddScalePlayground";
import { SpanPlayground } from "./SpanPlayground";
import { IndependencePlayground } from "./IndependencePlayground";
import { EigenPlayground } from "./EigenPlayground";
import { EigenDiscoverPlayground } from "./EigenDiscoverPlayground";
import { SVDPlayground } from "./SVDPlayground";
import { SVDImagePlayground } from "./SVDImagePlayground";
import { PCAPlayground } from "./PCAPlayground";
import { LeastSquaresPlayground } from "./LeastSquaresPlayground";
import { IntersectPlayground } from "./IntersectPlayground";
import { RowOpsPlayground } from "./RowOpsPlayground";
import { GaussianPlayground } from "./GaussianPlayground";
import { RREFPlayground2 } from "./RREFPlayground2";
import { HomogeneousPlayground } from "./HomogeneousPlayground";
import { IndependencePlayground2 } from "./IndependencePlayground2";
import { BasisPlayground } from "./BasisPlayground";
import { DimensionPlayground } from "./DimensionPlayground";
import { TransformationPlayground } from "./TransformationPlayground";
import { LinearMattersPlayground } from "./LinearMattersPlayground";
const Transform3DPlayground = dynamic(() => import("./Transform3DPlayground").then(m => m.Transform3DPlayground), { ssr: false, loading: () => <div className="bg-card border border-line rounded-xl p-8 text-center text-dim">Loading 3D...</div> });
import { NullRangePlayground2 } from "./NullRangePlayground2";
import { RankNullityPlayground } from "./RankNullityPlayground";
import { IsomorphismPlayground } from "./IsomorphismPlayground";
import { FourSubspacesPlayground } from "./FourSubspacesPlayground";
import { RowColPlayground } from "./RowColPlayground";
import { FunctionalPlayground } from "./FunctionalPlayground";
import { DualSpacePlayground } from "./DualSpacePlayground";
import { DualBasisPlayground } from "./DualBasisPlayground";
import { AnnihilatorPlayground } from "./AnnihilatorPlayground";
import { TransposePlayground } from "./TransposePlayground";
import { DoubleDualPlayground } from "./DoubleDualPlayground";
import type { PlaygroundId } from "@/lib/curriculum";

export function Playground({ id }: { id: PlaygroundId }) {
  switch (id) {
    // Phase 1 — Systems of Linear Equations
    case "lines-2d":
      return <LinePlayground />;
    case "intersect":
      return <IntersectPlayground />;
    case "matrix-times-vec":
      return <LinePlayground />; // legacy alias
    case "row-ops":
      return <RowOpsPlayground />;
    case "gaussian":
      return <GaussianPlayground />;
    case "rref":
      return <RREFPlayground2 />;
    case "homogeneous":
      return <HomogeneousPlayground />;

    // Phase 2 — Vector Spaces
    case "vector-arrow":
      return <VectorArrowPlayground />;
    case "add-scale":
      return <AddScalePlayground />;
    case "span":
      return <SpanPlayground />;
    case "independence":
      return <IndependencePlayground2 />;
    case "basis":
      return <BasisPlayground />;
    case "dimension":
      return <DimensionPlayground />;

    // Phase 3 — Linear Transformations
    case "transformation":
      return <TransformationPlayground />;
    case "linear-matters":
      return <LinearMattersPlayground />;
    case "transform-3d":
      return <Transform3DPlayground />;
    case "matrix-cols":
      return <MatrixColumnsPlayground />;
    case "matrix-times-mat":
      return <MatrixColumnsPlayground />; // reuse, shows multiplication in story
    case "null-range":
      return <NullRangePlayground2 />;
    case "rank-nullity":
      return <RankNullityPlayground />;
    case "isomorphism":
      return <IsomorphismPlayground />;
    case "big-four":
      return <MatrixColumnsPlayground />; // legacy
    case "determinant":
      return <MatrixColumnsPlayground />; // legacy
    case "inverse":
      return <MatrixColumnsPlayground />; // legacy
    case "rank":
      return <MatrixColumnsPlayground />; // legacy

    // Phase 4 — Four Subspaces & Dual
    case "four-subspaces":
      return <FourSubspacesPlayground />;
    case "row-col":
      return <RowColPlayground />;
    case "functional":
      return <FunctionalPlayground />;
    case "dual":
      return <DualSpacePlayground />;
    case "dual-basis":
      return <DualBasisPlayground />;
    case "annihilator":
      return <AnnihilatorPlayground />;
    case "transpose":
      return <TransposePlayground />;
    case "double-dual":
      return <DoubleDualPlayground />;

    // Phase 5 — Eigenvalues
    case "eigen-discover":
      return <EigenPlayground />;
    case "eigen-discover-v2":
      return <EigenDiscoverPlayground />;
    case "eigenvalue":
    case "characteristic":
    case "diagonalize":
      return <EigenPlayground />;

    // Phase 6 — SVD & Applications
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
          Playground for <code className="text-accent">{id}</code> is being built.
        </div>
      );
  }
}
