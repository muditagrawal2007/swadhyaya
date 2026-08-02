"use client";
import dynamic from "next/dynamic";
import { MatrixColumnsPlayground } from "./MatrixColumnsPlayground";
import { OneLinePlayground } from "./OneLinePlayground";
import { TwoLinesPlayground } from "./TwoLinesPlayground";
import { RREFPlayground } from "./RREFPlayground";
import { VectorArrowPlayground } from "./VectorArrowPlayground";
import { AddScalePlayground } from "./AddScalePlayground";
import { LinearCombinationPlayground } from "./LinearCombinationPlayground";
import { SpanPlayground } from "./SpanPlayground";
import { SubspacePlayground } from "./SubspacePlayground";
import { IndependencePlayground } from "./IndependencePlayground";
import { EigenPlayground } from "./EigenPlayground";
import { EigenDiscoverPlayground } from "./EigenDiscoverPlayground";
import { CharacteristicPlayground2 } from "./CharacteristicPlayground2";
import { CayleyHamiltonPlayground } from "./CayleyHamiltonPlayground";
import { MinimalPolynomialPlayground } from "./MinimalPolynomialPlayground";
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
const Planes3DPlayground = dynamic(() => import("./Planes3DPlayground").then(m => m.Planes3DPlayground), { ssr: false, loading: () => <div className="bg-card border border-line rounded-xl p-8 text-center text-dim">Loading 3D...</div> });
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
import { QL1Q1Playground } from "./QL1Q1Playground";
import { QE5Q1Playground } from "./QE5Q1Playground";
import type { PlaygroundId } from "@/lib/curriculum";

export function Playground({ id }: { id: PlaygroundId }) {
  switch (id) {
    // Phase 1 — Systems of Linear Equations
    case "lines-2d-one":
      return <OneLinePlayground />;
    case "lines-2d-two":
      return <TwoLinesPlayground />;
    case "intersect":
      return <IntersectPlayground />;
    case "planes-3d":
      return <Planes3DPlayground />;
    case "matrix-times-vec":
      return <OneLinePlayground />; // legacy alias
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
    case "linear-combination":
      return <LinearCombinationPlayground />;
    case "span":
      return <SpanPlayground />;
    case "subspace":
      return <SubspacePlayground />;
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
      return <MatrixColumnsPlayground />; // legacy alias for T7 (composition)
    case "null-range":
      return <NullRangePlayground2 />;
    case "rank-nullity":
      return <RankNullityPlayground />;
    case "isomorphism":
      return <IsomorphismPlayground />;
    case "big-four":
      return <MatrixColumnsPlayground />; // legacy alias
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
      return <EigenPlayground />;
    case "characteristic":
      return <EigenPlayground />;
    case "characteristic-2":
      return <CharacteristicPlayground2 />;
    case "cayley-hamilton":
      return <CayleyHamiltonPlayground />;
    case "minimal-poly":
      return <MinimalPolynomialPlayground />;
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

    // Question-specific playgrounds
    case "q-L1-q1":
      return <QL1Q1Playground />;
    case "q-E5-q1":
      return <QE5Q1Playground />;

    default:
      return (
        <div className="bg-card border border-line rounded-xl p-8 text-center text-dim">
          Playground for <code className="text-accent">{id}</code> is being built.
        </div>
      );
  }
}
