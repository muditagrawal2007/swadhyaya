"use client";
import { useProgress } from "@/lib/progress";
import { Trophy, Medal, Award } from "lucide-react";
import { useMemo } from "react";

export default function LeaderboardPage() {
  const battleHistory = useProgress((s) => s.battleHistory);
  const sorted = useMemo(
    () => [...battleHistory].sort((a, b) => b.score - a.score).slice(0, 20),
    [battleHistory],
  );
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <header className="mb-6">
        <div className="text-[10px] text-faint uppercase tracking-wider flex items-center gap-1">
          <Trophy size={10} className="text-singular" />
          Leaderboard
        </div>
        <h1 className="font-serif text-3xl text-ink mt-1">Your battles</h1>
        <p className="text-sm text-dim mt-1">
          Top 20 personal scores. Today and every day — climb the ranks.
        </p>
      </header>

      {sorted.length === 0 ? (
        <div className="bg-card border border-line rounded-xl p-12 text-center">
          <Award size={32} className="mx-auto text-faint" />
          <h2 className="mt-4 font-serif text-xl text-ink">No battles yet</h2>
          <p className="text-sm text-dim mt-1">
            Win your first daily battle to land on the board.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-line rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-elev/50 text-[10px] text-faint uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Rank</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Score</th>
                <th className="text-right px-4 py-3">Rank</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((b, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="px-4 py-3 font-mono text-ink">
                    {i === 0 ? <Medal size={14} className="inline text-singular mr-1" /> : null}
                    #{i + 1}
                  </td>
                  <td className="px-4 py-3 text-dim">{b.date}</td>
                  <td className="px-4 py-3 text-right font-mono text-accent">{b.score}</td>
                  <td className="px-4 py-3 text-right text-dim">{b.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
